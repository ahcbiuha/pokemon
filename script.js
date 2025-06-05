document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素引用 ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');

    const starterSelection = document.getElementById('starter-selection');
    const starterPokeballsContainer = document.getElementById('starter-pokeballs');

    const mapSelection = document.getElementById('map-selection');
    const mapGrid = document.getElementById('map-grid');
    const goToShopButton = document.getElementById('go-to-shop-button');

    const battleScreen = document.getElementById('battle-screen');
    const battleMessage = document.getElementById('battle-message');
    const opponentNameSpan = document.getElementById('opponent-name');
    const opponentHpText = document.getElementById('opponent-hp-text');
    const opponentMaxHpText = document.getElementById('opponent-max-hp-text');
    const opponentHpBar = document.getElementById('opponent-hp-bar');
    const playerPokemonNameSpan = document.getElementById('player-pokemon-name');
    const playerHpText = document.getElementById('player-hp-text');
    const playerMaxHpText = document.getElementById('player-max-hp-text');
    const playerHpBar = document.getElementById('player-hp-bar');
    const battleActions = document.getElementById('battle-actions');
    const attackButton = document.getElementById('attack-button'); // 現在會變成招式按鈕的容器
    const itemButton = document.getElementById('item-button');
    const switchPokemonButton = document.getElementById('switch-pokemon-button');
    const runButton = document.getElementById('run-button');
    const battleItemMenu = document.getElementById('battle-item-menu');
    const battleItemList = document.getElementById('battle-item-list');
    const battleSwitchMenu = document.getElementById('battle-switch-menu');
    const battleSwitchList = document.getElementById('battle-switch-list');
    const backToActionsButtons = document.querySelectorAll('.back-to-actions');

    const shopScreen = document.getElementById('shop-screen');
    const playerMoneyShopSpan = document.getElementById('player-money-shop');
    const shopItemsGrid = document.getElementById('shop-items-grid');
    const backToMapButton = document.getElementById('back-to-map-button');

    const pokeballSlots = document.getElementById('pokeball-slots');
    const itemBag = document.getElementById('item-bag');
    const currentMoneySpan = document.getElementById('current-money');

    const messageDisplay = document.getElementById('message-display');
    const pokemonFullModal = document.getElementById('pokemon-full-modal');
    const currentPokemonsForSelection = document.getElementById('current-pokemons-for-selection');
    const newPokemonNameSpan = document.getElementById('new-pokemon-name');
    const confirmReplacementButton = document.getElementById('confirm-replacement');
    const cancelReplacementButton = document.getElementById('cancel-replacement');

    // --- 遊戲數據與狀態 ---
    let playerPokemons = []; // 玩家攜帶的寶可夢隊伍 (最多 6 隻)
    let pokemonStorage = []; // 寶可夢背包 (無限隻)
    let playerItems = {}; // 玩家擁有的道具及其數量 (例如: { 'pokeball': 5, 'potion': 2 })
    let playerMoney = 0; // 玩家金錢，初始為 0，開局會贈送
    let currentOpponentPokemon = null; // 當前對戰中的野生寶可夢
    let currentPlayerActivePokemon = null; // 玩家當前出戰的寶可夢
    let battleTurnInProgress = false; // 防止回合重複觸發

    const MAX_POKEMONS = 6;
    let newlyAcquiredPokemon = null; // 暫存新獲得的寶可夢

    // 寶可夢招式數據
    const allMoves = {
        tackle: { name: '撞擊', power: 20, accuracy: 0.95, type: 'normal' },
        ember: { name: '火花', power: 30, accuracy: 0.9, type: 'fire' },
        waterGun: { name: '水槍', power: 30, accuracy: 0.9, type: 'water' },
        vineWhip: { name: '藤鞭', power: 30, accuracy: 0.9, type: 'grass' },
        peck: { name: '啄', power: 25, accuracy: 0.95, type: 'flying' },
        quickAttack: { name: '電光一閃', power: 20, accuracy: 1.0, type: 'normal' },
        leechLife: { name: '吸血', power: 20, accuracy: 0.9, type: 'bug' }
    };

    // 寶可夢數據 (擴展版：加入 defense, speed, type, moves, level, currentExp, expToNextLevel)
    const allPokemons = {
        charmander: { id: 'charmander', name: '小火龍', type: 'fire', maxHp: 80, currentHp: 80, attack: 15, defense: 10, speed: 18, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'ember'] },
        squirtle: { id: 'squirtle', name: '傑尼龜', type: 'water', maxHp: 90, currentHp: 90, attack: 12, defense: 13, speed: 15, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'waterGun'] },
        bulbasaur: { id: 'bulbasaur', name: '妙蛙種子', type: 'grass', maxHp: 85, currentHp: 85, attack: 13, defense: 12, speed: 16, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'vineWhip'] },
        pidgey: { id: 'pidgey', name: '波波', type: 'normal', maxHp: 60, currentHp: 60, attack: 10, defense: 8, speed: 20, catchRate: 0.6, baseExp: 30, level: 1, currentExp: 0, expToNextLevel: 80, moves: ['tackle', 'peck'] },
        rattata: { id: 'rattata', name: '小拉達', type: 'normal', maxHp: 50, currentHp: 50, attack: 12, defense: 7, speed: 22, catchRate: 0.7, baseExp: 25, level: 1, currentExp: 0, expToNextLevel: 70, moves: ['tackle', 'quickAttack'] },
        zubat: { id: 'zubat', name: '超音蝠', type: 'flying', maxHp: 70, currentHp: 70, attack: 11, defense: 9, speed: 25, catchRate: 0.5, baseExp: 40, level: 1, currentExp: 0, expToNextLevel: 90, moves: ['tackle', 'leechLife'] },
    };

    // 類型相剋表 (簡化版，你可以擴展更多類型和倍率)
    // 攻擊方類型 : { 防禦方類型 : 倍率 }
    const typeEffectiveness = {
        normal: { normal: 1, fire: 1, water: 1, grass: 1, flying: 1, bug: 1 },
        fire: { normal: 1, fire: 0.5, water: 0.5, grass: 2, flying: 1, bug: 2 },
        water: { normal: 1, fire: 2, water: 0.5, grass: 0.5, flying: 1, bug: 1 },
        grass: { normal: 1, fire: 0.5, water: 2, grass: 0.5, flying: 0.5, bug: 0.5 },
        flying: { normal: 1, fire: 1, water: 1, grass: 2, flying: 1, bug: 2 },
        bug: { normal: 1, fire: 0.5, water: 1, grass: 2, flying: 0.5, bug: 1 },
    };


    // 道具數據
    const allItems = {
        pokeball: { name: '寶貝球', type: 'catch', description: '用於捕捉寶可夢。', price: 200, effect: 1.0 }, // 捕捉率加成
        potion: { name: '傷藥', type: 'heal', description: '恢復寶可夢 20 HP。', price: 300, healAmount: 20 },
        superPotion: { name: '好傷藥', type: 'heal', description: '恢復寶可夢 50 HP。', price: 600, healAmount: 50 }
    };

    // 地圖數據 (每個地圖可遭遇的寶可夢，新增寶可夢等級範圍)
    const maps = [
        { id: 'map1', name: '新手森林', wildPokemons: [{ id: 'pidgey', level: [1, 3] }, { id: 'rattata', level: [1, 3] }] },
        { id: 'map2', name: '陽光平原', wildPokemons: [{ id: 'pidgey', level: [2, 4] }, { id: 'rattata', level: [2, 4] }, { id: 'zubat', level: [2, 4] }] },
        { id: 'map3', name: '神秘洞穴', wildPokemons: [{ id: 'zubat', level: [3, 5] }, { id: 'rattata', level: [3, 5] }] },
        { id: 'map4', name: '清澈溪流', wildPokemons: [{ id: 'squirtle', level: [4, 6] }, { id: 'pidgey', level: [3, 5] }] },
        { id: 'map5', name: '烈日沙漠', wildPokemons: [{ id: 'charmander', level: [4, 6] }, { id: 'rattata', level: [3, 5] }] },
        { id: 'map6', name: '花園小徑', wildPokemons: [{ id: 'bulbasaur', level: [4, 6] }, { id: 'pidgey', level: [3, 5] }] },
        { id: 'map7', name: '迷霧山谷', wildPokemons: [{ id: 'zubat', level: [5, 7] }, { id: 'pidgey', level: [4, 6] }] },
        { id: 'map8', name: '遠古遺跡', wildPokemons: [{ id: 'charmander', level: [6, 8] }, { id: 'squirtle', level: [6, 8] }, { id: 'bulbasaur', level: [6, 8] }] },
        { id: 'map9', name: '冠軍之路', wildPokemons: Object.keys(allPokemons).map(id => ({ id: id, level: [7, 10] })) } // 所有寶可夢
    ];

    // 商店出售的道具
    const shopItems = [
        { itemId: 'pokeball', quantity: 1, price: 200 },
        { itemId: 'potion', quantity: 1, price: 300 },
        { itemId: 'superPotion', quantity: 1, price: 600 }
    ];

    // --- 遊戲狀態切換函數 ---
    function showScreen(screenId) {
        const sections = document.querySelectorAll('.game-section');
        sections.forEach(section => section.classList.add('hidden'));
        battleScreen.classList.add('hidden');
        shopScreen.classList.add('hidden');

        if (screenId === 'starter-selection') {
            starterSelection.classList.remove('hidden');
        } else if (screenId === 'map-selection') {
            mapSelection.classList.remove('hidden');
        } else if (screenId === 'battle-screen') {
            battleScreen.classList.remove('hidden');
        } else if (screenId === 'shop-screen') {
            shopScreen.classList.remove('hidden');
        }
    }

    // --- UI 更新函數 ---
    function showMessage(message, duration = 2500) {
        messageDisplay.textContent = message;
        messageDisplay.classList.add('show');
        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, duration);
    }

    function updatePlayerPokemonsDisplay() {
        pokeballSlots.innerHTML = ''; // 清空現有顯示

        playerPokemons.forEach(pokemon => {
            const div = document.createElement('div');
            div.classList.add('owned-pokeball');
            // 顯示寶可夢名稱、等級和當前HP
            div.innerHTML = `<span>${pokemon.name}</span><br><span>Lv.${pokemon.level}</span><br><span>HP: ${pokemon.currentHp}/${pokemon.maxHp}</span>`;
            pokeballSlots.appendChild(div);
        });

        // 補滿空的寶可夢槽位
        for (let i = playerPokemons.length; i < MAX_POKEMONS; i++) {
            const div = document.createElement('div');
            div.classList.add('owned-pokeball', 'empty');
            div.textContent = '空槽位';
            pokeballSlots.appendChild(div);
        }
    }

    function updatePlayerItemsDisplay() {
        itemBag.innerHTML = ''; // 清空現有顯示
        let hasItems = false;
        for (const itemId in playerItems) {
            if (playerItems[itemId] > 0) {
                hasItems = true;
                const item = allItems[itemId];
                const li = document.createElement('li');
                li.textContent = `${item.name} x ${playerItems[itemId]}`;
                itemBag.appendChild(li);
            }
        }
        if (!hasItems) {
            const li = document.createElement('li');
            li.textContent = '背包是空的';
            itemBag.appendChild(li);
        }
    }

    function updatePlayerMoneyDisplay() {
        currentMoneySpan.textContent = playerMoney;
        playerMoneyShopSpan.textContent = playerMoney; // 更新商店的金錢顯示
    }

    // 更新戰鬥中的HP條
    function updateBattleHpDisplay() {
        if (!currentPlayerActivePokemon || !currentOpponentPokemon) return;

        playerPokemonNameSpan.textContent = `${currentPlayerActivePokemon.name} Lv.${currentPlayerActivePokemon.level}`;
        playerHpText.textContent = currentPlayerActivePokemon.currentHp;
        playerMaxHpText.textContent = currentPlayerActivePokemon.maxHp;
        const playerHpPercent = (currentPlayerActivePokemon.currentHp / currentPlayerActivePokemon.maxHp) * 100;
        playerHpBar.style.width = `${playerHpPercent}%`;
        if (playerHpPercent <= 25) {
            playerHpBar.style.backgroundColor = '#dc3545'; // Red when low
        } else if (playerHpPercent <= 50) {
            playerHpBar.style.backgroundColor = '#ffc107'; // Yellow when medium
        } else {
            playerHpBar.style.backgroundColor = '#28a745'; // Green
        }


        opponentNameSpan.textContent = `${currentOpponentPokemon.name} Lv.${currentOpponentPokemon.level}`;
        opponentHpText.textContent = currentOpponentPokemon.currentHp;
        opponentMaxHpText.textContent = currentOpponentPokemon.maxHp;
        const opponentHpPercent = (currentOpponentPokemon.currentHp / currentOpponentPokemon.maxHp) * 100;
        opponentHpBar.style.width = `${opponentHpPercent}%`;
        if (opponentHpPercent <= 25) {
            opponentHpBar.style.backgroundColor = '#dc3545';
        } else if (opponentHpPercent <= 50) {
            opponentHpBar.style.backgroundColor = '#ffc107';
        } else {
            opponentHpBar.style.backgroundColor = '#28a745';
        }
    }

    // 顯示寶可夢滿員時的選擇介面
    function showPokemonFullModal(newPokemon) {
        newlyAcquiredPokemon = newPokemon;
        newPokemonNameSpan.textContent = newPokemon.name;
        currentPokemonsForSelection.innerHTML = '';

        playerPokemons.forEach((pokemon, index) => {
            const div = document.createElement('div');
            div.classList.add('selectable-pokemon');
            div.dataset.index = index;
            div.innerHTML = `<span>${pokemon.name}</span><br><span>Lv.${pokemon.level}</span><br><span>HP: ${pokemon.currentHp}/${pokemon.maxHp}</span>`;

            currentPokemonsForSelection.appendChild(div);

            div.addEventListener('click', () => {
                document.querySelectorAll('.selectable-pokemon').forEach(pkDiv => {
                    pkDiv.classList.remove('selected');
                });
                div.classList.add('selected');
            });
        });

        pokemonFullModal.classList.remove('hidden');
    }

    function hidePokemonFullModal() {
        pokemonFullModal.classList.add('hidden');
        newlyAcquiredPokemon = null;
    }

    // --- 遊戲邏輯函數 ---

    // 處理獲得寶可夢
    function acquirePokemon(pokemonData) {
        // 深複製寶可夢數據，確保每個實例獨立
        const newPokemon = JSON.parse(JSON.stringify(pokemonData));
        showMessage(`獲得了 ${newPokemon.name}！`);

        if (playerPokemons.length < MAX_POKEMONS) {
            playerPokemons.push(newPokemon);
            updatePlayerPokemonsDisplay();
            // 如果是初始寶可夢，設定為出戰
            if (playerPokemons.length === 1 && !currentPlayerActivePokemon) {
                currentPlayerActivePokemon = newPokemon;
            }
        } else {
            showPokemonFullModal(newPokemon);
        }
        saveGame();
    }

    // 處理獲得道具 (或購買)
    function acquireItem(itemId, quantity = 1) {
        if (!playerItems[itemId]) {
            playerItems[itemId] = 0;
        }
        playerItems[itemId] += quantity;
        showMessage(`獲得了 ${allItems[itemId].name} x ${quantity}！`);
        updatePlayerItemsDisplay();
        saveGame();
    }

    // 扣除金錢
    function deductMoney(amount) {
        if (playerMoney >= amount) {
            playerMoney -= amount;
            updatePlayerMoneyDisplay();
            saveGame();
            return true;
        }
        showMessage('金錢不足！', 1500);
        return false;
    }

    // 增加金錢
    function addMoney(amount) {
        playerMoney += amount;
        updatePlayerMoneyDisplay();
        showMessage(`獲得了 ${amount} 金錢！`);
        saveGame();
    }

    // 檢查是否有寶可夢可以戰鬥 (HP > 0)
    function hasUsablePokemon() {
        return playerPokemons.some(p => p.currentHp > 0);
    }

    // --- 寶可夢等級與經驗值系統 ---
    function calculateExpToNextLevel(level) {
        return Math.floor(100 * (1.1 ** (level - 1))); // 簡單的指數成長模型
    }

    function gainExp(pokemon, exp) {
        pokemon.currentExp += exp;
        showMessage(`${pokemon.name} 獲得了 ${exp} 經驗值！`);

        while (pokemon.currentExp >= pokemon.expToNextLevel) {
            pokemon.currentExp -= pokemon.expToNextLevel;
            pokemon.level++;
            // 基礎屬性成長 (你可以根據寶可夢不同調整成長率)
            pokemon.maxHp = Math.floor(pokemon.maxHp * 1.05);
            pokemon.currentHp = pokemon.maxHp; // 升級回滿血
            pokemon.attack = Math.floor(pokemon.attack * 1.05);
            pokemon.defense = Math.floor(pokemon.defense * 1.05);
            pokemon.speed = Math.floor(pokemon.speed * 1.02);
            pokemon.expToNextLevel = calculateExpToNextLevel(pokemon.level);
            showMessage(`${pokemon.name} 升到了 Lv.${pokemon.level}！`, 3000);
            updatePlayerPokemonsDisplay(); // 更新界面顯示等級和HP
            updateBattleHpDisplay(); // 如果在戰鬥中，也更新戰鬥界面
        }
        saveGame();
    }

    // --- 對戰系統邏輯 ---

    function startBattle(wildPokemonId) {
        // 從地圖數據獲取野外寶可夢的等級範圍
        const mapInfo = maps.find(m => m.wildPokemons.some(wp => wp.id === wildPokemonId));
        const levelRange = mapInfo.wildPokemons.find(wp => wp.id === wildPokemonId).level;
        const randomLevel = Math.floor(Math.random() * (levelRange[1] - levelRange[0] + 1)) + levelRange[0];

        const baseWildPokemonData = allPokemons[wildPokemonId];
        // 根據等級調整野生寶可夢屬性 (簡化為線性成長，可優化)
        const wildPokemon = {
            ...baseWildPokemonData,
            level: randomLevel,
            maxHp: Math.floor(baseWildPokemonData.maxHp * (1 + (randomLevel - 1) * 0.1)),
            attack: Math.floor(baseWildPokemonData.attack * (1 + (randomLevel - 1) * 0.1)),
            defense: Math.floor(baseWildPokemonData.defense * (1 + (randomLevel - 1) * 0.1)),
            speed: Math.floor(baseWildPokemonData.speed * (1 + (randomLevel - 1) * 0.05)), // 速度成長可慢一點
        };
        wildPokemon.currentHp = wildPokemon.maxHp; // 野生寶可夢滿血出現

        currentOpponentPokemon = wildPokemon;

        // 確保玩家有出戰寶可夢
        if (!currentPlayerActivePokemon || currentPlayerActivePokemon.currentHp <= 0) {
            const firstUsable = playerPokemons.find(p => p.currentHp > 0);
            if (firstUsable) {
                currentPlayerActivePokemon = firstUsable;
            } else {
                showMessage('你的寶可夢都無法戰鬥了！', 3000);
                endBattle('faint'); // 戰敗
                return;
            }
        }

        showScreen('battle-screen');
        battleMessage.textContent = `野生的 Lv.${currentOpponentPokemon.level} ${currentOpponentPokemon.name} 出現了！`;
        updateBattleHpDisplay();
        setBattleMenu('actions');
        battleTurnInProgress = false; // 重置回合狀態
    }

    function endBattle(outcome) {
        currentOpponentPokemon = null; // 清空對手

        // 更新玩家寶可夢狀態，確保從 playerPokemons 中獲取最新的引用
        currentPlayerActivePokemon = playerPokemons.find(p => p.id === currentPlayerActivePokemon.id);

        if (outcome === 'win') {
            const expGained = Math.floor(currentOpponentPokemon.baseExp * (1 + (currentOpponentPokemon.level / 10))); // 根據等級調整經驗值
            gainExp(currentPlayerActivePokemon, expGained);
            addMoney(50 + Math.floor(Math.random() * 50 * (currentOpponentPokemon.level / 5))); // 戰勝獲得金錢，與等級掛鉤
            showMessage(`你戰勝了 Lv.${currentOpponentPokemon.level} ${currentOpponentPokemon.name}！`, 3000);
        } else if (outcome === 'flee') {
            showMessage('成功逃跑了！');
        } else if (outcome === 'capture') {
            // 捕捉成功訊息已在 acquirePokemon 中顯示
        } else if (outcome === 'faint') { // 玩家所有寶可夢都倒下了
            showMessage('你的寶可夢都倒下了，你戰敗了！', 3000);
            // 戰敗懲罰：扣除一半金錢或回寶可夢中心
            playerMoney = Math.floor(playerMoney / 2);
            showMessage('你失去了一半金錢！', 2000);
            // 所有寶可夢回滿血 (簡易處理)
            playerPokemons.forEach(p => p.currentHp = p.maxHp);
        }

        updatePlayerPokemonsDisplay(); // 更新 HP 顯示
        updatePlayerItemsDisplay();
        updatePlayerMoneyDisplay();
        saveGame(); // 保存遊戲狀態

        setTimeout(() => {
            showScreen('map-selection'); // 返回地圖選擇
            battleTurnInProgress = false; // 確保重置狀態
        }, 1500); // 延遲一下再切換畫面
    }

    function setBattleMenu(menuType) {
        battleActions.classList.add('hidden');
        battleItemMenu.classList.add('hidden');
        battleSwitchMenu.classList.add('hidden');

        if (menuType === 'actions') {
            battleActions.classList.remove('hidden');
            renderMoveButtons(currentPlayerActivePokemon); // 渲染招式按鈕
        } else if (menuType === 'items') {
            battleItemMenu.classList.remove('hidden');
            renderBattleItems();
        } else if (menuType === 'switch') {
            battleSwitchMenu.classList.remove('hidden');
            renderBattleSwitchList();
        }
    }

    // 渲染招式按鈕
    function renderMoveButtons(pokemon) {
        // 清空除了「道具」、「換寶可夢」、「逃跑」之外的按鈕
        const existingMoveButtons = battleActions.querySelectorAll('button:not(#item-button):not(#switch-pokemon-button):not(#run-button)');
        existingMoveButtons.forEach(btn => btn.remove());

        // 重新創建攻擊按鈕，現在是招式按鈕
        const itemBtn = document.getElementById('item-button');
        const switchBtn = document.getElementById('switch-pokemon-button');
        const runBtn = document.getElementById('run-button');

        pokemon.moves.forEach(moveId => {
            const move = allMoves[moveId];
            if (move) {
                const moveButton = document.createElement('button');
                moveButton.textContent = move.name;
                moveButton.classList.add('move-button'); // 可以給它加個類名
                moveButton.dataset.moveId = moveId;
                moveButton.addEventListener('click', () => playerTurn({ type: 'move', moveId: moveId }));
                // 將招式按鈕插入到道具按鈕之前
                battleActions.insertBefore(moveButton, itemBtn);
            }
        });
    }

    // 類型倍率計算
    function getTypeEffectiveness(attackerType, defenderType) {
        return (typeEffectiveness[attackerType] && typeEffectiveness[attackerType][defenderType]) || 1;
    }

    function playerTurn(action) {
        if (battleTurnInProgress) return; // 防止重複點擊
        battleTurnInProgress = true;

        if (currentPlayerActivePokemon.currentHp <= 0) {
            showMessage(`${currentPlayerActivePokemon.name} 已無法戰鬥！請更換寶可夢。`, 2000);
            setBattleMenu('switch');
            battleTurnInProgress = false;
            return;
        }
        if (currentOpponentPokemon.currentHp <= 0) {
            endBattle('win');
            battleTurnInProgress = false;
            return;
        }

        // 玩家行動
        if (action.type === 'move') {
            const move = allMoves[action.moveId];
            if (!move) {
                showMessage('無效的招式！', 1500);
                battleTurnInProgress = false;
                return;
            }

            // 命中判斷
            if (Math.random() > move.accuracy) {
                battleMessage.textContent = `${currentPlayerActivePokemon.name} 的 ${move.name} 落空了！`;
                setTimeout(opponentTurn, 1500);
                return;
            }

            // 傷害計算: (攻擊方攻擊力 / 防禦方防禦力) * 招式威力 * 屬性倍率 * 隨機浮動
            const effectiveness = getTypeEffectiveness(move.type, currentOpponentPokemon.type);
            let damage = Math.max(1,
                Math.floor(
                    (currentPlayerActivePokemon.attack / currentOpponentPokemon.defense) * move.power * effectiveness * (0.8 + Math.random() * 0.4) // 0.8~1.2 隨機浮動
                )
            );

            currentOpponentPokemon.currentHp = Math.max(0, currentOpponentPokemon.currentHp - damage);
            battleMessage.textContent = `${currentPlayerActivePokemon.name} 使用了 ${move.name}！`;
            if (effectiveness > 1) {
                battleMessage.textContent += `效果絕佳！`;
            } else if (effectiveness < 1) {
                battleMessage.textContent += `效果不理想...`;
            }
            battleMessage.textContent += `對 ${currentOpponentPokemon.name} 造成了 ${damage} 傷害！`;
            updateBattleHpDisplay();
        } else if (action.type === 'item') {
            if (playerItems[action.itemId] <= 0) {
                showMessage(`你沒有 ${allItems[action.itemId].name} 了！`, 1500);
                battleTurnInProgress = false;
                return;
            }
            playerItems[action.itemId]--;
            updatePlayerItemsDisplay();

            const item = allItems[action.itemId];
            if (item.type === 'heal') {
                const healedAmount = Math.min(currentPlayerActivePokemon.maxHp - currentPlayerActivePokemon.currentHp, item.healAmount);
                if (healedAmount === 0) {
                    showMessage(`${currentPlayerActivePokemon.name} 的 HP 已經是滿的了！`, 1500);
                    playerItems[action.itemId]++; // 未使用成功，歸還道具
                    updatePlayerItemsDisplay();
                    battleTurnInProgress = false;
                    return; // 道具未成功使用，不進入敵方回合
                }
                currentPlayerActivePokemon.currentHp = Math.min(currentPlayerActivePokemon.maxHp, currentPlayerActivePokemon.currentHp + item.healAmount);
                showMessage(`${currentPlayerActivePokemon.name} 恢復了 ${healedAmount} HP！`);
            } else if (item.type === 'catch') {
                attemptCapture(currentOpponentPokemon, item.effect);
                setBattleMenu('actions'); // 捕捉後返回主選單
                return; // 捕捉嘗試後不執行敵方回合，等待捕捉結果
            }
            updateBattleHpDisplay();
        } else if (action.type === 'switch') {
            const newActivePokemon = playerPokemons[action.pokemonIndex];
            if (newActivePokemon.currentHp <= 0) {
                showMessage(`${newActivePokemon.name} 已無法戰鬥！`, 1500);
                battleTurnInProgress = false;
                return;
            }
            if (newActivePokemon.id === currentPlayerActivePokemon.id && newActivePokemon.level === currentPlayerActivePokemon.level) { // 考慮同名但不同等級的情況
                showMessage(`${newActivePokemon.name} 已經在場上了！`, 1500);
                battleTurnInProgress = false;
                return;
            }
            currentPlayerActivePokemon = newActivePokemon;
            showMessage(`你換上了 ${currentPlayerActivePokemon.name}！`);
            updateBattleHpDisplay();
        } else if (action === 'run') {
            // 逃跑機率：基於速度差，玩家速度越高，逃跑機率越大
            const fleeChance = Math.min(0.95, Math.max(0.2, (currentPlayerActivePokemon.speed / currentOpponentPokemon.speed) * 0.4 + 0.1));
            if (Math.random() < fleeChance) {
                endBattle('flee');
                return; // 逃跑成功則結束戰鬥
            } else {
                showMessage('逃跑失敗了！', 1500);
            }
        }

        // 檢查戰鬥是否結束
        if (currentOpponentPokemon.currentHp <= 0) {
            battleMessage.textContent = `${currentOpponentPokemon.name} 倒下了！`;
            setTimeout(() => endBattle('win'), 1500);
            return;
        }

        // 延遲執行敵方回合，增加遊戲體驗
        setTimeout(opponentTurn, 1500);
    }

    function opponentTurn() {
        if (currentOpponentPokemon.currentHp <= 0) { // 再次檢查，防止延遲期間寶可夢倒下
            battleTurnInProgress = false;
            endBattle('win');
            return;
        }

        if (!currentPlayerActivePokemon || currentPlayerActivePokemon.currentHp <= 0) {
            // 玩家寶可夢倒下，檢查是否有可替換的
            const nextPokemon = playerPokemons.find(p => p.currentHp > 0);
            if (nextPokemon) {
                currentPlayerActivePokemon = nextPokemon;
                showMessage(`${currentPlayerActivePokemon.name} 上場了！`);
                updateBattleHpDisplay();
                setBattleMenu('actions'); // 回到主選單
                battleTurnInProgress = false; // 重置回合狀態
                return; // 等待玩家選擇
            } else {
                endBattle('faint'); // 所有寶可夢都倒下了
                battleTurnInProgress = false;
                return;
            }
        }

        // 敵方攻擊
        const opponentMoveId = currentOpponentPokemon.moves[Math.floor(Math.random() * currentOpponentPokemon.moves.length)];
        const opponentMove = allMoves[opponentMoveId];

        if (!opponentMove) {
            showMessage('對手沒有可用的招式！', 1500); // 應該不會發生
            battleTurnInProgress = false;
            setBattleMenu('actions');
            return;
        }

        // 命中判斷
        if (Math.random() > opponentMove.accuracy) {
            battleMessage.textContent = `${currentOpponentPokemon.name} 的 ${opponentMove.name} 落空了！`;
            battleTurnInProgress = false;
            setBattleMenu('actions');
            return;
        }

        const effectiveness = getTypeEffectiveness(opponentMove.type, currentPlayerActivePokemon.type);
        let damage = Math.max(1,
            Math.floor(
                (currentOpponentPokemon.attack / currentPlayerActivePokemon.defense) * opponentMove.power * effectiveness * (0.8 + Math.random() * 0.4)
            )
        );

        currentPlayerActivePokemon.currentHp = Math.max(0, currentPlayerActivePokemon.currentHp - damage);
        battleMessage.textContent = `${currentOpponentPokemon.name} 使用了 ${opponentMove.name}！`;
        if (effectiveness > 1) {
            battleMessage.textContent += `效果絕佳！`;
        } else if (effectiveness < 1) {
            battleMessage.textContent += `效果不理想...`;
        }
        battleMessage.textContent += `對 ${currentPlayerActivePokemon.name} 造成了 ${damage} 傷害！`;
        updateBattleHpDisplay();

        // 檢查戰鬥是否結束
        if (currentPlayerActivePokemon.currentHp <= 0) {
            battleMessage.textContent = `${currentPlayerActivePokemon.name} 倒下了！`;
            setTimeout(() => {
                if (!hasUsablePokemon()) {
                    endBattle('faint');
                } else {
                    showMessage('你的寶可夢倒下了！請更換寶可夢。', 2000);
                    setBattleMenu('switch');
                }
                battleTurnInProgress = false; // 重置回合狀態
            }, 1500);
            return;
        }

        battleTurnInProgress = false; // 回合結束，允許下一個行動
        setBattleMenu('actions'); // 返回玩家選擇介面
    }


    function renderBattleItems() {
        battleItemList.innerHTML = '';
        let hasBattleItems = false;
        for (const itemId in playerItems) {
            const item = allItems[itemId];
            if (playerItems[itemId] > 0 && (item.type === 'heal' || item.type === 'catch')) { // 只有治療和捕捉道具可以在戰鬥中使用
                hasBattleItems = true;
                const li = document.createElement('li');
                li.textContent = `${item.name} x ${playerItems[itemId]}`;
                li.addEventListener('click', () => {
                    playerTurn({ type: 'item', itemId: itemId });
                    // setBattleMenu('actions'); // 使用道具後返回主選單 (在 playerTurn 結束後處理)
                });
                battleItemList.appendChild(li);
            }
        }
        if (!hasBattleItems) {
            battleItemList.innerHTML = '<li>沒有可使用的道具。</li>';
        }
    }

    function renderBattleSwitchList() {
        battleSwitchList.innerHTML = '';
        playerPokemons.forEach((pokemon, index) => {
            const div = document.createElement('div');
            div.classList.add('battle-switch-pokemon-item');
            if (pokemon.id === currentPlayerActivePokemon.id && pokemon.level === currentPlayerActivePokemon.level) {
                div.classList.add('selected'); // 標記當前出戰寶可夢
            }
            div.innerHTML = `<span>${pokemon.name}</span><br><span>Lv.${pokemon.level}</span><br><span>HP: ${pokemon.currentHp}/${pokemon.maxHp}</span>`;

            if (pokemon.currentHp <= 0) {
                div.style.opacity = '0.5'; // 倒下的寶可夢半透明
                div.style.cursor = 'not-allowed';
            } else {
                div.addEventListener('click', () => {
                    if (pokemon.id !== currentPlayerActivePokemon.id || pokemon.level !== currentPlayerActivePokemon.level) { // 允許切換到不同等級的同名寶可夢
                        playerTurn({ type: 'switch', pokemonIndex: index });
                        // setBattleMenu('actions'); // 切換後返回主選單 (在 playerTurn 結束後處理)
                    } else {
                        showMessage(`${pokemon.name} 已經在場上了！`, 1500);
                    }
                });
            }
            battleSwitchList.appendChild(div);
        });
    }

    // 捕捉寶可夢
    function attemptCapture(pokemon, pokeballEffect) {
        // 簡化捕捉邏輯：HP越低越容易捕捉，寶貝球效果加成，等級差異也影響
        const hpFactor = (pokemon.currentHp / pokemon.maxHp); // HP越高，此值越大
        const levelFactor = (pokemon.level / currentPlayerActivePokemon.level); // 對手等級越高，越難抓

        // 基礎捕捉率 * 寶貝球效果 * (1 - HP百分比 + 一點隨機性) / 等級因子
        const effectiveCatchRate = pokemon.catchRate * pokeballEffect * (1 - hpFactor + 0.1) / (levelFactor > 1 ? levelFactor : 1);

        if (Math.random() < effectiveCatchRate) {
            acquirePokemon(pokemon); // 成功捕捉
            endBattle('capture');
        } else {
            showMessage(`捕捉失敗了！${pokemon.name} 掙脫了！`);
        }
    }

    // --- 商店系統邏輯 ---
    function renderShopItems() {
        shopItemsGrid.innerHTML = '';
        shopItems.forEach(shopItem => {
            const item = allItems[shopItem.itemId];
            if (!item) return; // 防止資料錯誤

            const div = document.createElement('div');
            div.classList.add('shop-item');
            div.innerHTML = `
                <h4>${item.name}</h4>
                <p>價格: ${shopItem.price} 金錢</p>
                <p>${item.description}</p>
                <button data-item-id="${shopItem.itemId}" data-price="${shopItem.price}">購買</button>
            `;
            shopItemsGrid.appendChild(div);
        });

        document.querySelectorAll('.shop-item button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.itemId;
                const price = parseInt(event.target.dataset.price);
                if (deductMoney(price)) {
                    acquireItem(itemId, 1); // 購買一個
                    showMessage(`購買了 ${allItems[itemId].name}！`);
                }
            });
        });
    }

    // --- 數據持久化 ---
    function saveGame() {
        const gameData = {
            playerPokemons: playerPokemons,
            pokemonStorage: pokemonStorage,
            playerItems: playerItems,
            playerMoney: playerMoney,
        };
        localStorage.setItem('pokemonGameData', JSON.stringify(gameData));
        console.log('遊戲已保存！');
    }

    function loadGame() {
        const savedData = localStorage.getItem('pokemonGameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            playerPokemons = gameData.playerPokemons || [];
            pokemonStorage = gameData.pokemonStorage || [];
            playerItems = gameData.playerItems || {};
            playerMoney = gameData.playerMoney || 0;

            // 確保加載後有出戰寶可夢 (選隊伍中第一個活著的)
            currentPlayerActivePokemon = playerPokemons.find(p => p.currentHp > 0);

            showMessage('遊戲已載入！', 2000);
            return true;
        }
        return false;
    }

    // --- 初始化函數 ---
    function initializeGame() {
        if (!loadGame()) { // 如果沒有存檔，給予初始資源
            playerMoney = 1000; // 初始金錢
            acquireItem('pokeball', 5);
            acquireItem('potion', 2);
            showMessage('開始新的冒險！', 3000);
        }
        updatePlayerPokemonsDisplay();
        updatePlayerItemsDisplay();
        updatePlayerMoneyDisplay();
    }

    // --- 事件監聽器 ---

    // 開始遊戲按鈕
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        if (playerPokemons.length === 0) { // 只有在沒有寶可夢的情況下才顯示選擇初始寶可夢
            showScreen('starter-selection');
            setupStarterChoices();
        } else { // 如果有存檔，直接進入地圖選擇
            showScreen('map-selection');
            setupMapButtons();
        }
        initializeGame(); // 載入遊戲數據
    });

    // 初始寶可夢選擇
    function setupStarterChoices() {
        starterPokeballsContainer.innerHTML = '';
        ['charmander', 'squirtle', 'bulbasaur'].forEach(key => {
            const pokemon = allPokemons[key];
            const div = document.createElement('div');
            div.classList.add('pokeball-choice');
            const p = document.createElement('p');
            p.textContent = pokemon.name;
            const pokeballText = document.createElement('span');
            pokeballText.classList.add('pokeball-text');
            pokeballText.textContent = '(寶貝球)';

            div.appendChild(p);
            div.appendChild(pokeballText);
            div.dataset.pokemonId = pokemon.id;

            starterPokeballsContainer.appendChild(div);

            div.addEventListener('click', () => {
                acquirePokemon(pokemon); // 選擇初始寶可夢並添加到隊伍
                starterSelection.classList.add('hidden');
                showScreen('map-selection'); // 進入地圖選擇
                setupMapButtons(); // 設置地圖按鈕
            });
        });
    }

    // 設置地圖按鈕
    function setupMapButtons() {
        mapGrid.innerHTML = '';
        maps.forEach((map, index) => {
            const button = document.createElement('button');
            button.classList.add('map-button');
            button.textContent = map.name;
            button.addEventListener('click', () => {
                // 隨機選擇地圖中的一種寶可夢
                const randomWildPokemonInfo = map.wildPokemons[Math.floor(Math.random() * map.wildPokemons.length)];
                startBattle(randomWildPokemonInfo.id);
            });
            mapGrid.appendChild(button);
        });
    }

    // 前往商店按鈕
    goToShopButton.addEventListener('click', () => {
        showScreen('shop-screen');
        renderShopItems();
    });

    // 返回地圖按鈕 (從商店)
    backToMapButton.addEventListener('click', () => {
        showScreen('map-selection');
    });

    // --- 對戰動作按鈕 ---
    // 攻擊按鈕已經被招式按鈕替換，此處不需要直接綁定
    itemButton.addEventListener('click', () => setBattleMenu('items'));
    switchPokemonButton.addEventListener('click', () => setBattleMenu('switch'));
    runButton.addEventListener('click', () => playerTurn('run'));

    // 返回對戰主選單按鈕
    backToActionsButtons.forEach(button => {
        button.addEventListener('click', () => setBattleMenu('actions'));
    });

    // 處理寶可夢滿員 modal 的確認替換
    confirmReplacementButton.addEventListener('click', () => {
        const selectedPokemonDiv = document.querySelector('.selectable-pokemon.selected');
        if (selectedPokemonDiv && newlyAcquiredPokemon) {
            const indexToReplace = parseInt(selectedPokemonDiv.dataset.index);
            const replacedPokemon = playerPokemons[indexToReplace];

            pokemonStorage.push(replacedPokemon);
            showMessage(`${replacedPokemon.name} 被放進了寶可夢背包。`);
            console.log('寶可夢背包:', pokemonStorage);

            playerPokemons[indexToReplace] = newlyAcquiredPokemon;
            showMessage(`隊伍中的 ${replacedPokemon.name} 被 ${newlyAcquiredPokemon.name} 替換了！`, 2000);
            updatePlayerPokemonsDisplay();
            hidePokemonFullModal();
            saveGame(); // 保存遊戲狀態
        } else if (newlyAcquiredPokemon) {
            showMessage('請選擇一隻寶可夢進行替換。', 1500);
        }
    });

    // 處理寶可夢滿員 modal 的取消 (將新寶可夢直接放入背包)
    cancelReplacementButton.addEventListener('click', () => {
        if (newlyAcquiredPokemon) {
            pokemonStorage.push(newlyAcquiredPokemon);
            showMessage(`${newlyAcquiredPokemon.name} 被直接放進了寶可夢背包。`, 2000);
            console.log('寶可夢背包:', pokemonStorage);
            hidePokemonFullModal();
            saveGame(); // 保存遊戲狀態
        }
    });

    // 確保初始載入時設定好初始寶可夢選擇畫面
    // 在 DOMContentLoaded 時，先嘗試載入遊戲，如果沒有存檔，再設置初始寶可夢選擇
    initializeGame();
    if (playerPokemons.length === 0) { // 如果沒有任何寶可夢 (新遊戲)
        setupStarterChoices();
    } else { // 如果有寶可夢 (載入遊戲)
        // 確保初始畫面是開始畫面，等待玩家點擊開始
        startScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    }
});