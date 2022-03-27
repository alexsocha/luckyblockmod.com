{{#extend "layouts/download-lucky-block" platform-text="for Minecraft: Java Edition + Fabric" }}
{{#content "main"}}
{{#markdown}}

## Version info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Minecraft Version: \{{meta.dependencies.minecraft.formattedVersionRange}}
-   Fabric Loader Version: \{{meta.dependencies.fabric-loader.formattedVersionRange}}
-   Built on: \{{meta.formattedDatetime}}

## Install instructions

1. Download and run the latest <a href="https://fabricmc.net/use/">Fabric Installer</a>.
2. Download the <a href="https://www.curseforge.com/minecraft/mc-mods/fabric-api/files">Fabric API</a>, and place it in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
3. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
4. Run Minecraft with the Lucky Block mod installed!

{{/markdown}}
{{/content}}
{{/extend}}
