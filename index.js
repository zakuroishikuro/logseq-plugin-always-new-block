async function createNewBlock({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  // カレントブロックに子が存在し、かつ折りたたまれていない場合
  if (!block["collapsed?"] && block.children.length > 0) {
    // カレントブロックに最初の子を挿入
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: true });
  } else {
    // カレントブロックの弟を挿入
    await logseq.Editor.insertBlock(uuid, blockContent, { sibling: true, before: false });
  }
}

async function _createFirstOrLastSibling({ uuid }, blockContent = "", addToLast = true) {
  const index = addToLast ? -1 : 0;
  const block = await logseq.Editor.getBlock(uuid);
  const parent = await logseq.Editor.getBlock(block.parent.id);
  // parent.uuidに挿入すると、parentがpageだった場合に失敗するので、parent.children[0]の兄弟要素に挿入する
  const firstUuid = Object.fromEntries([parent.children.at(index)]).uuid;
  await logseq.Editor.insertBlock(firstUuid, blockContent, { sibling: true, before: true });
}

async function createFirstSibling({ uuid }, blockContent = "") {
  await _createFirstOrLastSibling({ uuid }, blockContent, true);
}

async function createLastSibling({ uuid }, blockContent = "") {
  await _createFirstOrLastSibling({ uuid }, blockContent, false);
}

async function createNextSibling({ uuid }, blockContent = "") {
  await logseq.Editor.insertBlock(uuid, blockContent, { sibling: true, before: false });
}

async function createPreviousSibling({ uuid }, blockContent = "") {
  await logseq.Editor.insertBlock(uuid, blockContent, { sibling: true, before: true });
}

async function createFirstChildInCurrentBlock({ uuid }, blockContent = "") {
  await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: true });
}

async function createLastChildInCurrentBlock({ uuid }, blockContent = "") {
  await logseq.Editor.insertBlock(uuid, blockContent, { sibling: false, before: false });
}

async function _createFirstOrLastChildInPage(blockContent = "", addToLast = true) {
  const pageOrBlock = await logseq.Editor.getCurrentPage();
  if (pageOrBlock.parent) {
    const block = pageOrBlock
    _createFirstOrLastSibling(block, blockContent, addToLast);
    return
  }

  const page = pageOrBlock;
  if (addToLast) {
    await logseq.Editor.appendBlockInPage(page.uuid, blockContent);
  } else {
    await logseq.Editor.prependBlockInPage(page.uuid, blockContent);
  }
}

async function createFirstChildInCurrentPage({ _uuid }, blockContent = "") {
  _createFirstOrLastChildInPage(blockContent, true);
}

async function createLastChildInCurrentPage({ _uuid }, blockContent = "") {
  _createFirstOrLastChildInPage(blockContent, false);
}


function main() {
  logseq.App.registerCommandPalette({ key: 'createNewBlock', label: 'Create New Block', keybinding: { mode: "editing", binding: "alt+enter" } }, createNewBlock);

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