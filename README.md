# Always New Block

## Overview

This Logseq plugin provides a set of functionalities to efficiently manipulate blocks for the user. It enables various actions such as inserting new blocks, creating sibling blocks, and creating the first or last child blocks within a page.

## Why I Created This?

While using Logseq, I found myself concerned with the behavior of the Enter key. Specifically, when editing an empty block that's the last one, pressing Enter causes the block's indentation level to decrease. I wanted a feature that would always add a new block instead, but couldn't find such a setting.

That's why I created this plugin. The "Create New Block" function is designed to alter just that behavior. By default, it's assigned to 'alt+enter', but I plan to reassign it to the 'enter' key through the settings for a more intuitive experience.

## Features

*   **createNewBlock**:
    * Adds a new block under the current block.
    * Alternative for Enter Key Function.
*   **createFirstSibling / createLastSibling**:
    * Creates a first or last sibling block relative to the current block.
*   **createNextSibling / createPreviousSibling**:
    * Creates a sibling block either before or after the current block.
*   **createFirstChildInCurrentBlock / createLastChildInCurrentBlock**:
    * Creates the first or last child block within the current block.
*   **createFirstChildInCurrentPage / createLastChildInCurrentPage**:
    * Creates the first or last child block in the current page.

## Usage

*   Each feature can be accessed through the command palette.
*   Specific keybindings allow for quick execution of actions.

## Keybindings

*   Execute `Create New Block` with `Alt + Enter`.
*   Execute `Create Last Child In Current Block` with `Ctrl + Alt + Enter`.
*   Other functionalities are accessible via the command palette in editing mode.

## License

This plugin is released under the MIT License.