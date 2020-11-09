{{#extend "layouts/download-version" }}
{{#content "main"}}
{{#markdown}}

## Version info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Forge Version: \{{meta.forge_version}}
-   Built on: \{{meta.datetime_str}}

## Install instructions

1. Download and run the <a href="http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_{{meta.mc_version}}.html">Minecraft Forge installer</a>, choosing at least version \{{meta.forge_version}}.
2. Start Minecraft to make sure everything works.
3. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
4. Run Minecraft again, now with the Lucky Block installed.

{{/markdown}}
{{/content}}
{{/extend}}
