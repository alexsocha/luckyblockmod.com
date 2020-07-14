# Outcomes

## Base properties

These properties apply to all outcome types.

{{> arg-table args=outcomes.common }}

## Item

-   `type=item`

Drops an item.

{{> arg-table args=outcomes.item }}

## Block

-   `type=block`

Places a block.

{{> arg-table args=outcomes.block }}

## Entity

-   `type=entity`

Spawns an entity.

{{> arg-table args=outcomes.entity }}

## Structure

-   `type=structure`

Generates a structure, which has been [preconfigured](config_files#structures).

{{> arg-table args=outcomes.structure }}

## Command

-   `type=command`

Runs a Minecraft command.

{{> arg-table args=outcomes.command }}

## Difficulty

-   `type=difficulty`

Sets the difficulty level of the world. This can be used to ensure that monsters spawn.

{{> arg-table args=outcomes.difficulty }}

## Effect

-   `type=effect`

Gives a status effect to the player and/or surrounding entities.

{{> arg-table args=outcomes.effect }}

### Special effect

Special effects are non-standard effects added by the mod.

{{> special-id-table ids=outcomes.special_effect }}

## Explosion

-   `type=explosion`

Creates an explosion.

{{> arg-table args=outcomes.explosion }}

## Fill

-   `type=fill`

Fills an area blocks.

{{> arg-table args=outcomes.fill }}

## Message

-   `type=message`

Shows a message in the chat.

{{> arg-table args=outcomes.message }}

## Particle

-   `type=particle`

Creates one or more particles.

{{> arg-table args=outcomes.message }}

### Special particle

Special particles are particles/animations which exist game by default, but don't have standard IDs. They may also be accompanied by a sound.

{{> special-id-table ids=outcomes.special_particle }}

## Sound

-   `type=sound`

Plays a Minecraft sound.

{{> arg-table args=outcomes.sound }}

## Nothing

-   `type=nothing`

Does nothing. Mainly used for the Lucky Sword when no additional effect is desired.
