import moment from 'moment';
import semver, { SemVer } from 'semver';

export interface VersionRange {
    readonly minInclusive?: string;
    readonly minExclusive?: string;
    readonly maxInclusive?: string;
    readonly maxExclusive?: string;
}

export const formatDate = (date: Date): string => {
    return moment(date).format('YYYY-MM-DD HH:mm');
};

export const nextMinorVersion = (version: string): string => {
    const semanticVersion = semver.parse(semver.coerce(version))!!;
    return `${semanticVersion.major}.${semanticVersion.minor + 1}`;
};
export const nextMajorVersion = (version: string): string => {
    const semanticVersion = semver.parse(semver.coerce(version))!!;
    return `${semanticVersion.major + 1}`;
};

export const formatVersionRange = (versionRange: VersionRange): string => {
    const { minInclusive, minExclusive, maxInclusive, maxExclusive } = versionRange;

    if (minInclusive !== undefined && maxInclusive !== undefined && minInclusive === maxInclusive)
        return minInclusive;

    const minPart =
        minInclusive !== undefined
            ? `>=${minInclusive}`
            : minExclusive !== undefined
            ? `>${minExclusive}`
            : undefined;

    const maxPart =
        maxInclusive !== undefined
            ? `<=${maxInclusive}`
            : maxExclusive !== undefined
            ? `<${maxExclusive}`
            : undefined;

    return minPart !== undefined && maxPart !== undefined
        ? `${minPart}, ${maxPart}`
        : minPart !== undefined
        ? minPart
        : maxPart!!;
};

export const parseLooseSemver = (v: string | number): SemVer | undefined => {
    if (typeof v === 'number') return semver.parse(String(v)) ?? undefined;

    if (v.includes('-')) {
        const [part1, part2] = v.split('-');
        if (part1.split('.').length == 2)
            return semver.parse(`${part1}.0-${part2}`, { loose: true }) ?? undefined;
    }

    return semver.parse(v, { loose: true }) ?? undefined;
};
