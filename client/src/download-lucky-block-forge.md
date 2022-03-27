{{#extend "layouts/download-lucky-block" platform-text="for Minecraft: Java Edition + Forge" }}
{{#content "main"}}
{{#markdown}}

## Project info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Minecraft Version: \{{meta.dependencies.minecraft.formattedVersionRange}}
-   Forge Version: \{{meta.dependencies.forge.formattedVersionRange}}
-   Built on: \{{meta.formattedDatetime}}

## Install instructions

1. Download and run the <a href="http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_\{{meta.dependencies.minecraft.minInclusive}}.html">Minecraft Forge installer</a>.
2. Start Minecraft to make sure everything works.
3. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
4. Run Minecraft with the Lucky Block mod installed!

{{/markdown}}
{{/content}}
{{/extend}}
