# Always New Block

## Overview

This Logseq plugin provides a set of functionalities to efficiently manipulate blocks for the user. It enables various actions such as inserting new blocks, creating sibling blocks, and creating the first or last child blocks within a page.

## Why I Created This?

While using Logseq, I found myself concerned with the behavior of the Enter key. Specifically, when editing an empty block that's the last one, pressing Enter causes the block's indentation level to decrease. I wanted a feature that would always add a new block instead, but couldn't find such a setting.

That's why I created this plugin. The "Create New Block" function is designed to alter just that behavior. By default, it's assigned to 'alt+enter', but I plan to reassign it to the 'enter' key through the settings for a more intuitive experience.

## Features

*   **createNewBlock**
    *   **Summary**: Inserts a new block based on the current block's state. **Alternative for Enter Key Function.**
    *   **Details**: If the current block is not collapsed and has children, it inserts a new child block at the beginning. Otherwise, it inserts a new sibling block after the current block.
*   **createFirstSibling / createLastSibling**
    *   **Summary**: Inserts a new sibling block at the beginning or end of the current block's parent.
    *   **Details**: If the current block itself is a page, it inserts the new block as the first or last child of the page.
*   **createNextSibling / createPreviousSibling**
    *   **Summary**: Inserts a new sibling block either after or before the current block.
    *   **Details**: If the current block is zoomed in and selected, it inserts the new block as a child.
*   **createFirstChildInCurrentBlock / createLastChildInCurrentBlock**
    *   **Summary**: Inserts a new child block at either the beginning or end of the current block.
    *   **Details**: If the current block is collapsed, it will be expanded first before inserting the new child block.
*   **createFirstChildInCurrentPage / createLastChildInCurrentPage**
    *   **Summary**: Inserts a new block as the first or last child in the current page.
    *   **Details**: Depending on whether the current page is a page or a block, it appropriately inserts a new block at the designated location.

## Usage

*   Each feature can be accessed through the command palette.
*   Specific keybindings allow for quick execution of actions.

## Keybindings

*   Execute `Create New Block` with `Alt + Enter`.
*   Execute `Create Last Child In Current Block` with `Ctrl + Alt + Enter`.
*   Other functionalities are accessible via the command palette in editing mode.

## License

This plugin is released under the MIT License.