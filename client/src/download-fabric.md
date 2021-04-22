{{#extend "layouts/download-version" platform-text="for Minecraft: Java Edition + Fabric" }}
{{#content "main"}}
{{#markdown}}

## Version info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Minecraft Version: >=\{{meta.min_minecraft_version}}
-   Built on: \{{meta.datetime_str}}

## Install instructions

1. Download and run the latest <a href="https://fabricmc.net/use/">Fabric Installer</a>.
2. Download the <a href="https://www.curseforge.com/minecraft/mc-mods/fabric-api/files">Fabric API</a>, choosing a version compatible with Minecraft >=\{{meta.min_minecraft_version}}. Place this in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
3. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
4. Run Minecraft with the Lucky Block mod installed!

{{/markdown}}
{{/content}}
{{/extend}}
