async function createNewBlock({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  // 子が存在し、かつ、子が開かれている場合はカレントブロックの最初に要素を挿入し終了
  if (block.children.length > 0) {
    const closed = false; //How...
    if (!closed) {
      await createFirstChildToCurrent({ uuid }, blockContent);
      return
    }
  }

  // 次の要素が存在すれば、その前に要素を挿入
  const nextSibling = await logseq.Editor.getNextSiblingBlock(uuid);
  if (nextSibling) {
    await logseq.Editor.insertBlock(nextSibling.uuid, blockContent, { before: true });
    return
  }

  // 親ブロックが存在すれば、親ブロックの最後に要素を挿入
  const parent = await logseq.Editor.getBlock(block.parent.id);
  if (parent) {
    await logseq.Editor.insertBlock(parent.uuid, blockContent);
    return
  }

  // 親ブロックが存在しなければ、ページの最後に要素を挿入
  const page = await logseq.Editor.getPage(block.page.id);
  await logseq.Editor.appendBlockInPage(page.uuid, blockContent);
}

async function createFirstSibling({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  const parent = await logseq.Editor.getBlock(block.parent.id);
  const firstUuid = Object.fromEntries([parent.children[0]]).uuid;
  logseq.Editor.insertBlock(firstUuid, blockContent, { before: true });
}

async function createLastSibling({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  const parent = await logseq.Editor.getBlock(block.parent.id);
  logseq.Editor.insertBlock(parent.uuid, blockContent);
}

async function createNextSibling({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  const parent = await logseq.Editor.getBlock(block.parent.id);
  const siblingUuidList = parent.children.map((v) => Object.fromEntries([v]).uuid);
  const targetIndex = siblingUuidList.indexOf(block.uuid) + 1;
  if (targetIndex === siblingUuidList.length) {
    await logseq.Editor.insertBlock(parent.uuid, blockContent);
  } else {
    await logseq.Editor.insertBlock(siblingUuidList[targetIndex], blockContent, { before: true });
  }
}

async function createPrevSibling({ uuid }, blockContent = "") {
  await logseq.Editor.insertBlock({ uuid }, blockContent, { before: true });
}

async function createFirstChildToCurrent({ uuid }, blockContent = "") {
  const block = await logseq.Editor.getBlock(uuid);
  if (block.children.length === 0) {
    insertLastChild(uuid);
  } else {
    const firstChildUuid = Object.fromEntries([block.children[0]]).uuid;
    logseq.Editor.insertBlock(firstChildUuid, blockContent, { before: true });
  }
}

async function createLastChildToCurrent({ uuid }, blockContent = "") {
  logseq.Editor.insertBlock(uuid, blockContent);
}

function main() {
  logseq.App.registerCommandPalette({ key: 'createNewBlock', label: 'Create New Block', keybinding: { mode: "editing", binding: "alt+enter" }, }, createNewBlock);

  logseq.App.registerCommandPalette({ key: 'createFirstSibling', label: 'Create First Sibling', keybinding: { mode: "editing" }, }, createFirstSibling);
  logseq.App.registerCommandPalette({ key: 'createLastSibling', label: 'Create Last Sibling', keybinding: { mode: "editing" }, }, createLastSibling);
  logseq.App.registerCommandPalette({ key: 'createNextSibling', label: 'Create Next Sibling', keybinding: { mode: "editing" }, }, createNextSibling);
  logseq.App.registerCommandPalette({ key: 'createPrevSibling', label: 'Create Prev Sibling', keybinding: { mode: "editing" }, }, createPrevSibling);

  logseq.App.registerCommandPalette({ key: 'createFirstChildToCurrent', label: 'Create First Child To Current', keybinding: { mode: "editing" }, }, createFirstChildToCurrent);
  logseq.App.registerCommandPalette({ key: 'createLastChildToCurrent', label: 'Create Last Child To Current', keybinding: { mode: "editing", binding: "ctrl+alt+enter" }, }, createLastChildToCurrent);
};

logseq.ready(main).catch(console.error)