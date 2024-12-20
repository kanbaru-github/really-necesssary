document.addEventListener('DOMContentLoaded', function() {
    // アイテムリストを読み込む
    loadItems();
  
    // 追加ボタンのイベントリスナー
    document.getElementById('addItem').addEventListener('click', function() {
      const name = document.getElementById('itemName').value;
      const date = document.getElementById('dateNeeded').value;
      
      if (name && date) {
        addItem(name, date);
        document.getElementById('itemName').value = '';
        document.getElementById('dateNeeded').value = '';
      }
    });
  });
  
  // アイテムを追加する関数
  function addItem(name, date) {
    chrome.storage.sync.get(['items'], function(result) {
      const items = result.items || [];
      const newItem = {
        name: name,
        date: date,
        count: 1,
        timestamp: new Date().toISOString()
      };
      
      items.push(newItem);
      chrome.storage.sync.set({ items: items }, function() {
        loadItems();
      });
    });
  }
  
  // アイテムリストを表示する関数
  function loadItems() {
    const itemList = document.getElementById('itemList');
    chrome.storage.sync.get(['items'], function(result) {
      itemList.innerHTML = '';
      const items = result.items || [];
      
      items.forEach(function(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
          <div>名前: ${item.name}</div>
          <div>必要な時期: ${item.date}</div>
          <div>記録回数: ${item.count}</div>
          <button onclick="removeItem(${index})">削除</button>
          <button onclick="incrementCount(${index})">カウント+1</button>
        `;
        itemList.appendChild(itemDiv);
      });
    });
  }
  
  // アイテムを削除する関数
  function removeItem(index) {
    chrome.storage.sync.get(['items'], function(result) {
      const items = result.items || [];
      items.splice(index, 1);
      chrome.storage.sync.set({ items: items }, function() {
        loadItems();
      });
    });
  }
  
  // カウントを増やす関数
  function incrementCount(index) {
    chrome.storage.sync.get(['items'], function(result) {
      const items = result.items || [];
      items[index].count += 1;
      chrome.storage.sync.set({ items: items }, function() {
        loadItems();
      });
    });
  }