{{#extend "layouts/download-version" platform-text="for Minecraft: Java Edition + Forge" }}
{{#content "main"}}
{{#markdown}}

## Version info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Minecraft Version: >=\{{meta.min_minecraft_version}}
-   Forge Version: >=\{{meta.min_forge_version}}
-   Built on: \{{meta.datetime_str}}

## Install instructions

1. Download and run the <a href="http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_{{meta.mc_version}}.html">Minecraft Forge installer</a>, choosing at least version \{{meta.min_forge_version}}.
2. Start Minecraft to make sure everything works.
3. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
4. Run Minecraft with the Lucky Block mod installed!

{{/markdown}}
{{/content}}
{{/extend}}
