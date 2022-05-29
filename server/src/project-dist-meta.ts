import * as R from 'ramda';
import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as semver from 'semver';
import {
    VersionRange,
    formatDate,
    nextMajorVersion,
    nextMinorVersion,
    formatVersionRange,
    parseLooseSemver,
} from './utils';

export enum ProjectName {
    LUCKY_BLOCK_FORGE = 'lucky-block-forge',
    LUCKY_BLOCK_FABRIC = 'lucky-block-fabric',
    CUSTOM_LUCKY_BLOCK_JAVA = 'custom-lucky-block-java',
}

interface ProjectDistMetaYamlV1 {
    readonly metafileVersion: undefined;
    readonly version: string;
    readonly version_number: number;
    readonly min_minecraft_version: string;
    readonly min_java_version: string;
    readonly min_forge_version?: string;
    readonly min_fabric_loader_version?: string;
    readonly datetime: Date;
}

interface ProjectDistMetaYaml {
    readonly metafileVersion: 2;
    readonly projectName: ProjectName;
    readonly version: string;
    readonly datetime: Date;
    readonly dependencies: {
        readonly [k: string]: VersionRange;
    };
}
interface ProjectDistMeta extends ProjectDistMetaYaml {
    readonly versionNumber: number;
    readonly formattedDatetime: string;
    readonly dependencies: {
        readonly [k: string]: VersionRange & {
            readonly formattedVersionRange: string;
        };
    };
}

export const isValidProjectName = (projectName: string): projectName is ProjectName => {
    return Object.values(ProjectName).includes(projectName as ProjectName);
};

export const fromShortProjectName = (shortProjectName: string): ProjectName | undefined => {
    if (shortProjectName === 'forge') return ProjectName.LUCKY_BLOCK_FORGE;
    else if (shortProjectName === 'fabric') return ProjectName.LUCKY_BLOCK_FABRIC;
    else R.find((projectName) => projectName === shortProjectName, Object.values(ProjectName));
};

export const getDistFileExtension = (projectName: ProjectName): string => {
    if (projectName === ProjectName.LUCKY_BLOCK_FORGE) return 'jar';
    else if (projectName === ProjectName.LUCKY_BLOCK_FABRIC) return 'jar';
    else return 'zip';
};

const getLuckyBlockVersionAsInt = (modVersion: string): number => {
    const splitVersion = modVersion.split('-');
    const minecraftVersion = splitVersion[0].split('.');
    const luckyBlockVersion = splitVersion[1].split('.');
    return (
        parseInt(minecraftVersion[0]) * 100000000 +
        parseInt(minecraftVersion[1]) * 1000000 +
        parseInt(minecraftVersion[2] ?? '0') * 10000 +
        parseInt(luckyBlockVersion[0]) * 100 +
        parseInt(luckyBlockVersion[1])
    );
};

const convertV1ToLatest = (
    projectName: ProjectName,
    metaV1: ProjectDistMetaYamlV1
): ProjectDistMetaYaml => {
    const dependencies: { [k: string]: VersionRange } = {};

    if (metaV1.min_java_version !== undefined)
        dependencies['java'] = {
            minInclusive: metaV1.min_java_version,
            maxInclusive: metaV1.min_java_version,
        };
    if (metaV1.min_minecraft_version !== undefined)
        dependencies['minecraft'] = {
            minInclusive: metaV1.min_minecraft_version,
            maxInclusive: metaV1.min_minecraft_version,
        };
    if (metaV1.min_forge_version !== undefined)
        dependencies['forge'] = {
            minInclusive: metaV1.min_forge_version,
            maxExclusive: nextMajorVersion(metaV1.min_forge_version),
        };
    if (metaV1.min_fabric_loader_version !== undefined)
        dependencies['fabric-loader'] = {
            minInclusive: metaV1.min_fabric_loader_version,
            maxExclusive: nextMinorVersion(metaV1.min_fabric_loader_version),
        };

    return {
        metafileVersion: 2,
        projectName: projectName,
        version: metaV1.version,
        datetime: metaV1.datetime,
        dependencies: dependencies,
    };
};

const fromYaml = (projectName: ProjectName, yamlStr: string): ProjectDistMeta => {
    const metaYamlAnyVersion = jsyaml.load(yamlStr) as ProjectDistMetaYamlV1 | ProjectDistMetaYaml;
    const metaYaml =
        metaYamlAnyVersion.metafileVersion == undefined
            ? convertV1ToLatest(projectName, metaYamlAnyVersion)
            : metaYamlAnyVersion;

    return {
        ...metaYaml,
        versionNumber:
            projectName === ProjectName.LUCKY_BLOCK_FORGE ||
            projectName === ProjectName.LUCKY_BLOCK_FABRIC
                ? getLuckyBlockVersionAsInt(metaYaml.version)
                : 0,
        formattedDatetime: formatDate(metaYaml.datetime),
        dependencies: R.mapObjIndexed(
            (dep) => ({ ...dep, formattedVersionRange: formatVersionRange(dep) }),
            metaYaml.dependencies
        ),
    };
};

const haveMinDepsHaveChanged = (prevMeta: ProjectDistMeta, newMeta: ProjectDistMeta): boolean => {
    return R.any(([depName]) => {
        if (!(depName in prevMeta.dependencies)) return true;

        const [prevDep, newDep] = [prevMeta.dependencies[depName], newMeta.dependencies[depName]];
        if (prevDep.minInclusive === undefined && newDep.minInclusive !== undefined) return true;
        if (prevDep.minExclusive === undefined && newDep.minExclusive !== undefined) return true;

        const [prevDepVersion, newDepVersion] =
            prevDep.minInclusive !== undefined
                ? [prevDep.minInclusive!!, newDep.minInclusive!!]
                : [prevDep.minExclusive!!, newDep.minExclusive!!];

        // if prevDepVersion < newDepVersion
        if (parseLooseSemver(prevDepVersion)!!.compare(parseLooseSemver(newDepVersion)!!) === -1)
            return true;

        return false;
    }, Object.entries(newMeta.dependencies));
};

export type SortedProjectDistMetas = {
    readonly [k in ProjectName]: readonly ProjectDistMeta[];
};
export const readProjectDistMetas = async (distDir: string): Promise<SortedProjectDistMetas> => {
    const distFolders: readonly string[] = await fs.promises.readdir(distDir).catch(() => {
        console.error(`${distDir} is empty`);
        return [];
    });

    const projectDistMetasOrNull = await Promise.all(
        distFolders.map(async (folderName) => {
            try {
                const projectName = R.find(
                    (projectName) => folderName.startsWith(projectName),
                    Object.values(ProjectName)
                );
                if (projectName !== undefined) {
                    const metaYamlStr = await fs.promises.readFile(
                        path.join(distDir, folderName, 'meta.yaml'),
                        'utf-8'
                    );
                    return fromYaml(projectName, metaYamlStr);
                }
                return undefined;
            } catch (e) {
                console.error(e);
                return undefined;
            }
        }, distFolders)
    );
    const metas = projectDistMetasOrNull.filter((v): v is ProjectDistMeta => v !== undefined);

    const metasByProject = (R.reduceBy(
        (acc, meta) => acc.concat([meta]),
        [] as Array<ProjectDistMeta>,
        (meta) => meta.projectName,
        metas
    ) as unknown) as SortedProjectDistMetas;

    const sortedMetasByProject: SortedProjectDistMetas = R.mapObjIndexed(
        R.sortWith([
            (a, b) => semver.compare(parseLooseSemver(b.version)!!, parseLooseSemver(a.version)!!),
        ]),
        metasByProject
    );

    // exclude versions where the minimum dependencies have not changed
    // (e.g. so that only the latest bugfix version is included)
    return R.mapObjIndexed(
        R.reduce((acc, meta) => {
            if (acc.length === 0) return [meta];

            const newerMeta = acc[acc.length - 1];
            if (haveMinDepsHaveChanged(meta, newerMeta)) acc.push(meta);

            return acc;
        }, [] as ProjectDistMeta[]),
        sortedMetasByProject
    );
};
