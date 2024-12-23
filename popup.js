document.addEventListener("DOMContentLoaded", () => {
  loadItems();

  document.getElementById("addItem").addEventListener("click", () => {
    const name = document.getElementById("itemName").value;
    const date = document.getElementById("dateNeeded").value;

    if (name && date) {
      addItem(name, date);
      document.getElementById("itemName").value = "";
      document.getElementById("dateNeeded").value = "";
    }
  });

  // itemListのイベント委譲
  document.getElementById("itemList").addEventListener("click", e => {
    const target = e.target;
    if (target.matches(".delete-btn")) {
      const index = parseInt(target.dataset.index);
      removeItem(index);
    } else if (target.matches(".increment-btn")) {
      const index = parseInt(target.dataset.index);
      incrementCount(index);
    }
  });
});

/**
 * アイテムを追加する関数
 * @param {string} name
 * @param {string} date
 */
const addItem = (name, date) => {
  chrome.storage.sync.get(["items"], result => {
    const items = result.items || [];
    const newItem = {
      name: name,
      date: date,
      count: 1,
      timestamp: new Date().toISOString(),
    };

    items.push(newItem);
    chrome.storage.sync.set({ items: items }, () => {
      loadItems();
    });
  });
};

/**
 * リストを読み込み
 */
const loadItems = () => {
  const itemList = document.getElementById("itemList");

  chrome.storage.sync.get(["items"], result => {
    itemList.textContent = "";
    const items = result.items || [];

    items.forEach((item, index) => {
      const itemHTML = `
        <ul class="items">
          <li>品名: ${item.name}</li>
          <li>登録時期: ${item.date}</li>
          <li>記録回数: ${item.count}</li>
          <li>
            <ul>
              <button class="delete-btn" data-index="${index}">Delete</button>
              <button class="increment-btn" data-index="${index}">Record!</button>
            </ul>
          </li>
        </ul>
      `;
      itemList.insertAdjacentHTML("beforeend", itemHTML);
    });
  });
};

/**
 * アイテム削除
 */
const removeItem = index => {
  chrome.storage.sync.get(["items"], result => {
    const items = result.items || [];
    items.splice(index, 1);
    chrome.storage.sync.set({ items: items }, () => {
      loadItems();
    });
  });
};

/**
 * カウントアップ
 * @param {Number} index
 */
const incrementCount = index => {
  chrome.storage.sync.get(["items"], result => {
    const items = result.items || [];
    if (items[index]) {
      items[index].count = (items[index].count || 0) + 1;
      chrome.storage.sync.set({ items: items }, () => {
        loadItems();
      });
    }
  });
};
