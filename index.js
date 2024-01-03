async function createNewBlock({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  // カレントブロックに子が存在し、展開されているとき
  if (block.children.length > 0 && !block["collapsed?"]) {
    // カレントブロックに最初の子を挿入
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: true });
  } else {
    // カレントブロックの後ろにブロックを挿入
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: true, before: false });
  }
}

async function _createFirstOrLastBlockInPage(page, blockContent = "", addToLast = true) {
  const children = await logseq.Editor.getPageBlocksTree(page.uuid);
  const index = addToLast ? -1 : 0;
  const targetBlock = children.at(index);
  await logseq.Editor.insertBlock(targetBlock.uuid, blockContent, { sibling: true, before: !addToLast });
}

async function _createFirstOrLastSibling({ uuid }, blockContent = "", addToLast = true) {
  // ブロックにズームインしていて、そのブロックが選択されていたときはそのブロックの子を作成
  const currentPageOrBlock = await logseq.Editor.getCurrentPage();
  if (currentPageOrBlock.uuid === uuid) {
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: !addToLast });
    return
  }

  const block = await logseq.Editor.getBlock(uuid);
  const parentBlock = await logseq.Editor.getBlock(block.parent?.id);
  // 親ブロックが存在するとき
  if (parentBlock) {
    // 親ブロックに最初 or 最後の子ブロックを挿入
    await logseq.Editor.insertBlock(parentBlock.uuid, blockContent, { sibling: false, before: !addToLast });
  } else {
    // 親ブロックが存在しないときはページの最初 or 最後のブロックを挿入
    const page = await logseq.Editor.getPage(block.page.id);
    await _createFirstOrLastBlockInPage(page, blockContent, addToLast);
  }
}

async function _createFirstOrLastBlockInCurrentBlockOrPage(blockContent = "", addToLast) {
  const pageOrBlock = await logseq.Editor.getCurrentPage();
  const isPage = "name" in pageOrBlock;
  // カレントページがページのとき
  if (isPage) {
    // ページに最初 or 最後のブロックを挿入
    const page = pageOrBlock;
    _createFirstOrLastBlockInPage(page, blockContent, false);
  } else {
    // ブロックに最初 or 最後の子ブロックを挿入
    const block = pageOrBlock;
    await logseq.Editor.insertBlock(block.uuid, blockContent, { sibling: false, before: !addToLast });
  }
}

async function _createNextOrPreviousSibling({ uuid }, blockContent = "", addAfter = true) {
  const currentPageOrBlock = await logseq.Editor.getCurrentPage();
  // ブロックにズームインしていてそのブロックが選択されていたとき
  if (currentPageOrBlock.uuid === uuid) {
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: true });
  } else {
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: true, before: !addAfter });
  }
}

async function _createFirstOrLastChildInCurrentBlock({ uuid }, blockContent = "", addToLast = true) {
  const block = await logseq.Editor.getBlock(uuid);
  // カレントブロックが折りたたまれているときは展開
  if (block["collapsed?"]) {
    await logseq.Editor.setBlockCollapsed(uuid, false);
  }
  await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: !addToLast });
}

async function createFirstSibling({ uuid }, blockContent = "") {
  await _createFirstOrLastSibling({ uuid }, blockContent, false);
}

async function createLastSibling({ uuid }, blockContent = "") {
  await _createFirstOrLastSibling({ uuid }, blockContent, true);
}

async function createNextSibling({ uuid }, blockContent = "") {
  await _createNextOrPreviousSibling({ uuid }, blockContent, true);
}

async function createPreviousSibling({ uuid }, blockContent = "") {
  await _createNextOrPreviousSibling({ uuid }, blockContent, false);
}

async function createFirstChildInCurrentBlock({ uuid }, blockContent = "") {
  await _createFirstOrLastChildInCurrentBlock({ uuid }, blockContent, false);
}

async function createLastChildInCurrentBlock({ uuid }, blockContent = "") {
  await _createFirstOrLastChildInCurrentBlock({ uuid }, blockContent, true);
}

async function createFirstChildInCurrentPage({ _uuid }, blockContent = "") {
  _createFirstOrLastBlockInCurrentBlockOrPage(blockContent, false);
}

async function createLastChildInCurrentPage({ _uuid }, blockContent = "") {
  _createFirstOrLastBlockInCurrentBlockOrPage(blockContent, true);
}


function main() {
  logseq.App.registerCommandPalette({ key: 'createNewBlock', label: 'Create New Block', keybinding: { mode: "editing", binding: "alt+enter" } }, createFirstChildInCurrentBlock);
  //logseq.App.registerCommandPalette({ key: 'createNewBlock', label: 'Create New Block', keybinding: { mode: "editing", binding: "alt+enter" } }, createNewBlock);

  logseq.App.registerCommandPalette({ key: 'createFirstSibling', label: 'Create First Sibling', keybinding: { mode: "editing" } }, createFirstSibling);
  logseq.App.registerCommandPalette({ key: 'createLastSibling', label: 'Create Last Sibling', keybinding: { mode: "editing" } }, createLastSibling);
  logseq.App.registerCommandPalette({ key: 'createNextSibling', label: 'Create Next Sibling', keybinding: { mode: "editing" } }, createNextSibling);
  logseq.App.registerCommandPalette({ key: 'createPreviousSibling', label: 'Create Previous Sibling', keybinding: { mode: "editing" }, }, createPreviousSibling);

  logseq.App.registerCommandPalette({ key: 'createFirstChildInCurrentBlock', label: 'Create First Child In Current Block', keybinding: { mode: "editing" } }, createFirstChildInCurrentBlock);
  logseq.App.registerCommandPalette({ key: 'createLastChildInCurrentBlock', label: 'Create Last Child In Current Block', keybinding: { mode: "editing", binding: "ctrl+alt+enter" } }, createLastChildInCurrentBlock);

  logseq.App.registerCommandPalette({ key: 'createFirstChildInCurrentPage', label: 'Create First Child In Current Page', keybinding: { mode: "editing" } }, createFirstChildInCurrentPage);
  logseq.App.registerCommandPalette({ key: 'createLastChildInCurrentPage', label: 'Create Last Child In CurrentPage', keybinding: { mode: "editing" } }, createLastChildInCurrentPage);

};

logseq.ready(main).catch(console.error)