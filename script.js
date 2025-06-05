document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素引用 ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen'); // Main container for map/info
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
    const opponentSprite = document.getElementById('opponent-sprite'); // Added for sprite
    const playerPokemonNameSpan = document.getElementById('player-pokemon-name');
    const playerHpText = document.getElementById('player-hp-text');
    const playerMaxHpText = document.getElementById('player-max-hp-text');
    const playerHpBar = document.getElementById('player-hp-bar');
    const playerSprite = document.getElementById('player-sprite'); // Added for sprite
    const battleActions = document.getElementById('battle-actions');
    // const attackButton = document.getElementById('attack-button'); // This is now mostly a container, not a direct button
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

    // 新增經驗值條 DOM 元素
    const playerExpText = document.getElementById('player-exp-text');
    const playerExpToNextLevelText = document.getElementById('player-exp-to-next-level-text');
    const playerExpBar = document.getElementById('player-exp-bar');

    // 新增戰鬥結束選項模態視窗 DOM 元素
    const battleEndOptionsModal = document.getElementById('battle-end-options-modal');
    const battleOutcomeMessage = document.getElementById('battle-outcome-message');
    const returnToMapButton = document.getElementById('return-to-map-button');
    const encounterAgainButton = document.getElementById('encounter-again-button');


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
    let lastEncounteredWildPokemonId = null; // 儲存上次遇到的野生寶可夢 ID

    // 寶可夢招式數據
    const allMoves = {
        tackle: { name: '撞擊', power: 20, accuracy: 0.95, type: 'normal' },
        ember: { name: '火花', power: 30, accuracy: 0.9, type: 'fire' },
        waterGun: { name: '水槍', power: 30, accuracy: 0.9, type: 'water' },
        vineWhip: { name: '藤鞭', power: 30, accuracy: 0.9, type: 'grass' },
        peck: { name: '啄', power: 25, accuracy: 0.95, type: 'flying' },
        quickAttack: { name: '電光一閃', power: 20, accuracy: 1.0, type: 'normal' },
        leechLife: { name: '吸血', power: 20, accuracy: 0.9, type: 'bug' },
        // 新增招式
        stringShot: { name: '吐絲', power: 0, accuracy: 0.95, type: 'bug', effect: 'lowerSpeed' }, // 假設可以降低對手速度
        poisonSting: { name: '毒針', power: 15, accuracy: 1.0, type: 'poison' }, // 假設有中毒機率
        thunderShock: { name: '電擊', power: 35, accuracy: 0.9, type: 'electric' },
    };

    // 寶可夢數據 (擴展版：加入 defense, speed, type, moves, level, currentExp, expToNextLevel)
    const allPokemons = {
        charmander: { id: 'charmander', name: '小火龍', type: 'fire', maxHp: 80, currentHp: 80, attack: 15, defense: 10, speed: 18, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'ember'] },
        squirtle: { id: 'squirtle', name: '傑尼龜', type: 'water', maxHp: 90, currentHp: 90, attack: 12, defense: 13, speed: 15, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'waterGun'] },
        bulbasaur: { id: 'bulbasaur', name: '妙蛙種子', type: 'grass', maxHp: 85, currentHp: 85, attack: 13, defense: 12, speed: 16, catchRate: 0.3, baseExp: 50, level: 1, currentExp: 0, expToNextLevel: 100, moves: ['tackle', 'vineWhip'] },
        pidgey: { id: 'pidgey', name: '波波', type: 'normal', maxHp: 60, currentHp: 60, attack: 10, defense: 8, speed: 20, catchRate: 0.6, baseExp: 30, level: 1, currentExp: 0, expToNextLevel: 80, moves: ['tackle', 'peck'] },
        rattata: { id: 'rattata', name: '小拉達', type: 'normal', maxHp: 50, currentHp: 50, attack: 12, defense: 7, speed: 22, catchRate: 0.7, baseExp: 25, level: 1, currentExp: 0, expToNextLevel: 70, moves: ['tackle', 'quickAttack'] },
        zubat: { id: 'zubat', name: '超音蝠', type: 'flying', maxHp: 70, currentHp: 70, attack: 11, defense: 9, speed: 25, catchRate: 0.5, baseExp: 40, level: 1, currentExp: 0, expToNextLevel: 90, moves: ['tackle', 'leechLife'] },
        // 新增寶可夢
        caterpie: { id: 'caterpie', name: '綠毛蟲', type: 'bug', maxHp: 65, currentHp: 65, attack: 8, defense: 7, speed: 15, catchRate: 0.8, baseExp: 20, level: 1, currentExp: 0, expToNextLevel: 60, moves: ['tackle', 'stringShot'] },
        weedle: { id: 'weedle', name: '獨角蟲', type: 'bug', maxHp: 60, currentHp: 60, attack: 9, defense: 6, speed: 18, catchRate: 0.75, baseExp: 22, level: 1, currentExp: 0, expToNextLevel: 65, moves: ['tackle', 'poisonSting'] },
        ekans: { id: 'ekans', name: '阿柏蛇', type: 'poison', maxHp: 75, currentHp: 75, attack: 14, defense: 9, speed: 17, catchRate: 0.4, baseExp: 45, level: 1, currentExp: 0, expToNextLevel: 95, moves: ['tackle', 'poisonSting'] },
        pikachu: { id: 'pikachu', name: '皮卡丘', type: 'electric', maxHp: 70, currentHp: 70, attack: 16, defense: 8, speed: 30, catchRate: 0.25, baseExp: 60, level: 1, currentExp: 0, expToNextLevel: 120, moves: ['tackle', 'thunderShock'] },
        // 您可以繼續在此處添加更多寶可夢
    };

    // 類型相剋表 (簡化版，你可以擴展更多類型和倍率)
    // 攻擊方類型 : { 防禦方類型 : 倍率 }
    const typeEffectiveness = {
        normal: { normal: 1, fire: 1, water: 1, grass: 1, flying: 1, bug: 1, poison: 1, electric: 1 },
        fire: { normal: 1, fire: 0.5, water: 0.5, grass: 2, flying: 1, bug: 2, poison: 1, electric: 1 },
        water: { normal: 1, fire: 2, water: 0.5, grass: 0.5, flying: 1, bug: 1, poison: 1, electric: 1 },
        grass: { normal: 1, fire: 0.5, water: 2, grass: 0.5, flying: 0.5, bug: 0.5, poison: 0.5, electric: 1 },
        flying: { normal: 1, fire: 1, water: 1, grass: 2, flying: 1, bug: 2, poison: 1, electric: 0.5 },
        bug: { normal: 1, fire: 0.5, water: 1, grass: 2, flying: 0.5, bug: 1, poison: 0.5, electric: 1 },
        // 新增的屬性相剋關係
        poison: { normal: 1, fire: 1, water: 1, grass: 2, flying: 1, bug: 1, poison: 0.5, electric: 1 },
        electric: { normal: 1, fire: 1, water: 2, grass: 0.5, flying: 2, bug: 1, poison: 1, electric: 0.5 },
    };


    // 道具數據
    const allItems = {
        pokeball: { name: '寶貝球', type: 'catch', description: '用於捕捉寶可夢。', price: 200, effect: 1.0 }, // 捕捉率加成
        potion: { name: '傷藥', type: 'heal', description: '恢復寶可夢 20 HP。', price: 300, healAmount: 20 },
        superPotion: { name: '好傷藥', type: 'heal', description: '恢復寶可夢 50 HP。', price: 600, healAmount: 50 }
    };

    // 地圖數據 (每個地圖可遭遇的寶可夢，新增寶可夢等級範圍)
    const maps = [
        { id: 'map1', name: '新手森林', wildPokemons: [{ id: 'pidgey', level: [1, 3] }, { id: 'rattata', level: [1, 3] }, { id: 'caterpie', level: [1, 2] }] }, // 新增綠毛蟲
        { id: 'map2', name: '陽光平原', wildPokemons: [{ id: 'pidgey', level: [2, 4] }, { id: 'rattata', level: [2, 4] }, { id: 'zubat', level: [2, 4] }, { id: 'weedle', level: [2, 3] }] }, // 新增獨角蟲
        { id: 'map3', name: '神秘洞穴', wildPokemons: [{ id: 'zubat', level: [3, 5] }, { id: 'rattata', level: [3, 5] }, { id: 'ekans', level: [3, 4] }] }, // 新增阿柏蛇
        { id: 'map4', name: '清澈溪流', wildPokemons: [{ id: 'squirtle', level: [4, 6] }, { id: 'pidgey', level: [3, 5] }] },
        { id: 'map5', name: '烈日沙漠', wildPokemons: [{ id: 'charmander', level: [4, 6] }, { id: 'rattata', level: [3, 5] }] },
        { id: 'map6', name: '花園小徑', wildPokemons: [{ id: 'bulbasaur', level: [4, 6] }, { id: 'pidgey', level: [3, 5] }] },
        { id: 'map7', name: '迷霧山谷', wildPokemons: [{ id: 'zubat', level: [5, 7] }, { id: 'pidgey', level: [4, 6] }, { id: 'pikachu', level: [5, 6] }] }, // 新增皮卡丘
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
        // Hide all major game sections first
        const mainSections = [startScreen, starterSelection, gameScreen, battleScreen, shopScreen];
        mainSections.forEach(section => {
            if (section) section.classList.add('hidden'); // Ensure section exists before accessing
        });
        // Also hide any active modals
        if (battleEndOptionsModal) battleEndOptionsModal.classList.add('hidden');
        if (pokemonFullModal) pokemonFullModal.classList.add('hidden');


        // Then show the specific screen requested
        if (screenId === 'starter-selection') {
            starterSelection.classList.remove('hidden');
        } else if (screenId === 'map-selection') {
            gameScreen.classList.remove('hidden'); // Crucial: Show the main game-screen container
            mapSelection.classList.remove('hidden'); // Show the map-selection within it
        } else if (screenId === 'battle-screen') {
            battleScreen.classList.remove('hidden');
        } else if (screenId === 'shop-screen') {
            shopScreen.classList.remove('hidden');
        }
    }

    // --- UI 更新函數 ---
    function showMessage(message, duration = 2500) {
        if (!messageDisplay) return; // Safegaurd if element not found
        messageDisplay.textContent = message;
        messageDisplay.classList.add('show');
        setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, duration);
    }

    function updatePlayerPokemonsDisplay() {
        if (!pokeballSlots) return;
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
        if (!itemBag) return;
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
        if (currentMoneySpan) currentMoneySpan.textContent = playerMoney;
        if (playerMoneyShopSpan) playerMoneyShopSpan.textContent = playerMoney; // 更新商店的金錢顯示
    }

    // 更新戰鬥中的HP條和經驗值條
    function updateBattleHpDisplay() {
        if (!currentPlayerActivePokemon || !currentOpponentPokemon) {
            // If no active pokemon, clear sprites or set to default
            if (playerSprite) playerSprite.src = 'https://placehold.co/100x100/eeeeee/000000?text=我方';
            if (opponentSprite) opponentSprite.src = 'https://placehold.co/100x100/eeeeee/000000?text=野生';
            return;
        }

        // Update player's Pokemon stats and sprite
        if (playerPokemonNameSpan && playerHpText && playerMaxHpText && playerHpBar && playerSprite) {
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
            // Update player sprite (back view)
            playerSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${getPokemonSpriteId(currentPlayerActivePokemon.id)}.png`;
            playerSprite.alt = currentPlayerActivePokemon.name;
        }


        // 更新玩家寶可夢的經驗值條
        if (playerExpText && playerExpToNextLevelText && playerExpBar) {
            playerExpText.textContent = currentPlayerActivePokemon.currentExp;
            playerExpToNextLevelText.textContent = currentPlayerActivePokemon.expToNextLevel;
            const playerExpPercent = (currentPlayerActivePokemon.currentExp / currentPlayerActivePokemon.expToNextLevel) * 100;
            playerExpBar.style.width = `${playerExpPercent}%`;
        }

        // Update opponent's Pokemon stats and sprite
        if (opponentNameSpan && opponentHpText && opponentMaxHpText && opponentHpBar && opponentSprite) {
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
            // Update opponent sprite (front view)
            opponentSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonSpriteId(currentOpponentPokemon.id)}.png`;
            opponentSprite.alt = currentOpponentPokemon.name;
        }
    }

    // 顯示寶可夢滿員時的選擇介面
    function showPokemonFullModal(newPokemon) {
        if (!pokemonFullModal || !newPokemonNameSpan || !currentPokemonsForSelection) return;

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
        if (pokemonFullModal) pokemonFullModal.classList.add('hidden');
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
        updateBattleHpDisplay(); // 即時更新經驗條

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
        lastEncounteredWildPokemonId = wildPokemonId; // 記錄本次遭遇的寶可夢 ID

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
        // 更新玩家寶可夢狀態，確保從 playerPokemons 中獲取最新的引用
        if (currentPlayerActivePokemon) { // 確保有活動寶可夢
             currentPlayerActivePokemon = playerPokemons.find(p => p.id === currentPlayerActivePokemon.id && p.level === currentPlayerActivePokemon.level);
        }


        // 顯示戰鬥結果訊息
        let message = '';
        if (outcome === 'win') {
            const expGained = Math.floor(currentOpponentPokemon.baseExp * (1 + (currentOpponentPokemon.level / 10))); // 根據等級調整經驗值
            gainExp(currentPlayerActivePokemon, expGained);
            addMoney(50 + Math.floor(Math.random() * 50 * (currentOpponentPokemon.level / 5))); // 戰勝獲得金錢，與等級掛鉤
            message = `你戰勝了 Lv.${currentOpponentPokemon.level} ${currentOpponentPokemon.name}！`;
        } else if (outcome === 'flee') {
            message = '成功逃跑了！';
        } else if (outcome === 'capture') {
            message = `你成功捕捉了 ${newlyAcquiredPokemon ? newlyAcquiredPokemon.name : currentOpponentPokemon.name}！`;
        } else if (outcome === 'faint') { // 玩家所有寶可夢都倒下了
            message = '你的寶可夢都倒下了，你戰敗了！';
            // 戰敗懲罰：扣除一半金錢或回寶可夢中心
            playerMoney = Math.floor(playerMoney / 2);
            showMessage('你失去了一半金錢！', 2000);
            // 所有寶可夢回滿血 (簡易處理)
            playerPokemons.forEach(p => p.currentHp = p.maxHp);
        }

        battleOutcomeMessage.textContent = message; // 設置模態視窗內的訊息

        // 確保在顯示選項前更新所有顯示
        updatePlayerPokemonsDisplay(); // 更新 HP 和等級顯示
        updatePlayerItemsDisplay();
        updatePlayerMoneyDisplay();
        saveGame(); // 保存遊戲狀態

        // 延遲一下顯示選項，讓玩家看到最終戰鬥訊息
        setTimeout(() => {
            battleScreen.classList.add('hidden'); // 先隱藏戰鬥畫面
            battleEndOptionsModal.classList.remove('hidden'); // 顯示選項模態視窗
            battleTurnInProgress = false; // 確保重置狀態
        }, 1500);

        currentOpponentPokemon = null; // 清空對手，準備下次戰鬥
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

        // 重新創建攻擊按鈕，現在是招式按式
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

        if (!currentPlayerActivePokemon || currentPlayerActivePokemon.currentHp <= 0) {
            showMessage(`${currentPlayerActivePokemon ? currentPlayerActivePokemon.name : '你的寶可夢'} 已無法戰鬥！請更換寶可夢。`, 2000);
            setBattleMenu('switch');
            battleTurnInProgress = false;
            return;
        }
        if (!currentOpponentPokemon || currentOpponentPokemon.currentHp <= 0) {
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

            // 處理招式效果 (範例：吐絲降低速度)
            if (move.effect === 'lowerSpeed') {
                if (Math.random() < 0.5) { // 50% 機率成功
                    currentOpponentPokemon.speed = Math.max(1, Math.floor(currentOpponentPokemon.speed * 0.8));
                    battleMessage.textContent += ` ${currentOpponentPokemon.name} 的速度降低了！`;
                }
            }

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
        if (!currentOpponentPokemon || currentOpponentPokemon.currentHp <= 0) { // 再次檢查，防止延遲期間寶可夢倒下
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
        const effectiveCatchRate = pokemon.catchRate * pokeballEffect * (1 - hpFactor + 0.1) / (levelFactor > 1 ? levelFactor : 1); // 確保 levelFactor 至少為 1，避免除以零或超級高的捕捉率

        battleMessage.textContent = `你投出了寶貝球！`;

        setTimeout(() => {
            if (Math.random() < effectiveCatchRate) {
                battleMessage.textContent = `恭喜！你抓到了 Lv.${pokemon.level} ${pokemon.name}！`;
                acquirePokemon(pokemon); // 將捕獲的寶可夢加入隊伍或背包
                // 捕捉成功後，endBattle會處理戰鬥結束
                endBattle('capture');
            } else {
                battleMessage.textContent = `${pokemon.name} 掙脫了！`;
                // 捕捉失敗後，輪到對手行動
                setTimeout(opponentTurn, 1000);
            }
        }, 1500);
    }

    // --- 遊戲初始化與事件監聽 ---
    function initializeGame() {
        // 檢查是否有存檔
        loadGame();

        if (playerPokemons.length === 0) {
            // 如果沒有寶可夢 (新遊戲或沒有存檔)，顯示初始選擇畫面
            showScreen('starter-selection');
            renderStarterPokeballs();
            playerMoney = 1000; // 贈送初始金錢
            acquireItem('pokeball', 5); // 贈送初始寶貝球
            acquireItem('potion', 2); // 贈送初始傷藥
        } else {
            // 如果有存檔，直接進入地圖選擇畫面
            showScreen('map-selection');
            // 確保有出戰寶可夢，如果存檔後沒有，則選第一個可用的
            if (!currentPlayerActivePokemon || currentPlayerActivePokemon.currentHp <= 0) {
                currentPlayerActivePokemon = playerPokemons.find(p => p.currentHp > 0) || playerPokemons[0];
            }
            updatePlayerPokemonsDisplay();
            updatePlayerItemsDisplay();
            updatePlayerMoneyDisplay();
        }
    }

    function saveGame() {
        const gameState = {
            playerPokemons: playerPokemons,
            pokemonStorage: pokemonStorage,
            playerItems: playerItems,
            playerMoney: playerMoney,
            currentPlayerActivePokemonId: currentPlayerActivePokemon ? currentPlayerActivePokemon.id : null,
            currentPlayerActivePokemonLevel: currentPlayerActivePokemon ? currentPlayerActivePokemon.level : null, // 保存等級以區分同名寶可夢
        };
        localStorage.setItem('pokemonGameSave', JSON.stringify(gameState));
    }

    function loadGame() {
        const savedState = localStorage.getItem('pokemonGameSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            playerPokemons = gameState.playerPokemons;
            pokemonStorage = gameState.pokemonStorage;
            playerItems = gameState.playerItems;
            playerMoney = gameState.playerMoney;

            // 恢復 currentPlayerActivePokemon
            if (gameState.currentPlayerActivePokemonId) {
                currentPlayerActivePokemon = playerPokemons.find(
                    p => p.id === gameState.currentPlayerActivePokemonId && p.level === gameState.currentPlayerActivePokemonLevel
                );
                // 如果找不到（例如寶可夢被替換了），則嘗試找第一個可用的
                if (!currentPlayerActivePokemon || currentPlayerActivePokemon.currentHp <= 0) {
                    currentPlayerActivePokemon = playerPokemons.find(p => p.currentHp > 0) || playerPokemons[0];
                }
            } else if (playerPokemons.length > 0) {
                currentPlayerActivePokemon = playerPokemons[0]; // 如果沒有記錄出戰寶可夢，選第一個
            }

            showMessage('遊戲已讀取！');
            updatePlayerPokemonsDisplay();
            updatePlayerItemsDisplay();
            updatePlayerMoneyDisplay();
            return true;
        }
        return false;
    }

    // 選擇初始寶可夢
    function renderStarterPokeballs() {
        starterPokeballsContainer.innerHTML = '';
        const starters = ['charmander', 'squirtle', 'bulbasaur'];
        starters.forEach(id => {
            const pokemon = allPokemons[id];
            const div = document.createElement('div');
            div.classList.add('pokeball-choice');
            div.dataset.pokemonId = id;
            div.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonSpriteId(id)}.png" alt="${pokemon.name}" class="pokemon-sprite-small"><span>${pokemon.name}</span>`;
            div.addEventListener('click', () => {
                acquirePokemon(pokemon);
                starterSelection.classList.add('hidden');
                showScreen('map-selection');
            });
            starterPokeballsContainer.appendChild(div);
        });
    }

    // 獲取寶可夢圖片 ID 的輔助函數 (您可以自己維護圖片，或者使用 PokeAPI 的 ID)
    function getPokemonSpriteId(pokemonId) {
        switch (pokemonId) {
            case 'charmander': return 4;
            case 'squirtle': return 7;
            case 'bulbasaur': return 1;
            case 'pidgey': return 16;
            case 'rattata': return 19;
            case 'zubat': return 41;
            case 'caterpie': return 10;
            case 'weedle': return 13;
            case 'ekans': return 23;
            case 'pikachu': return 25;
            default: return 0; // 預設或未知寶可夢圖片
        }
    }


    // 渲染地圖格子
    function renderMapGrid() {
        mapGrid.innerHTML = '';
        maps.forEach(map => {
            const div = document.createElement('div');
            div.classList.add('map-cell');
            div.textContent = map.name;
            div.dataset.mapId = map.id;
            div.addEventListener('click', () => {
                // 從該地圖可遭遇的寶可夢中隨機選擇一隻
                const possibleEncounters = map.wildPokemons;
                if (possibleEncounters.length > 0) {
                    const randomIndex = Math.floor(Math.random() * possibleEncounters.length);
                    const wildPokemonData = possibleEncounters[randomIndex];
                    startBattle(wildPokemonData.id);
                } else {
                    showMessage('這個區域沒有寶可夢！', 1500);
                }
            });
            mapGrid.appendChild(div);
        });
    }

    // 渲染商店商品
    function renderShopItems() {
        shopItemsGrid.innerHTML = '';
        shopItems.forEach(shopItem => {
            const item = allItems[shopItem.itemId];
            if (item) {
                const div = document.createElement('div');
                div.classList.add('shop-item');
                div.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>價格: ${shopItem.price} 金錢</p>
                    <button class="buy-button" data-item-id="${shopItem.itemId}" data-item-price="${shopItem.price}">購買</button>
                `;
                shopItemsGrid.appendChild(div);
            }
        });

        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.itemId;
                const itemPrice = parseInt(event.target.dataset.itemPrice);
                if (deductMoney(itemPrice)) {
                    acquireItem(itemId, 1);
                }
            });
        });
    }

    // --- 主要事件監聽器 ---
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        initializeGame();
    });

    goToShopButton.addEventListener('click', () => {
        showScreen('shop-screen');
        renderShopItems();
    });

    backToMapButton.addEventListener('click', () => {
        showScreen('map-selection');
    });

    itemButton.addEventListener('click', () => setBattleMenu('items'));
    switchPokemonButton.addEventListener('click', () => setBattleMenu('switch'));
    runButton.addEventListener('click', () => playerTurn('run'));

    backToActionsButtons.forEach(button => {
        button.addEventListener('click', () => setBattleMenu('actions'));
    });

    confirmReplacementButton.addEventListener('click', () => {
        const selectedPokemonDiv = document.querySelector('.selectable-pokemon.selected');
        if (selectedPokemonDiv) {
            const indexToReplace = parseInt(selectedPokemonDiv.dataset.index);
            const oldPokemon = playerPokemons[indexToReplace];

            // 將舊寶可夢放入背包
            pokemonStorage.push(oldPokemon);
            showMessage(`${oldPokemon.name} 被送到了寶可夢背包。`, 2000);

            // 替換為新寶可夢
            playerPokemons[indexToReplace] = newlyAcquiredPokemon;
            showMessage(`你將 ${newlyAcquiredPokemon.name} 加入了隊伍！`, 2000);

            hidePokemonFullModal();
            updatePlayerPokemonsDisplay();
            saveGame();
        } else {
            showMessage('請選擇一隻寶可夢來替換。', 1500);
        }
    });

    cancelReplacementButton.addEventListener('click', () => {
        pokemonStorage.push(newlyAcquiredPokemon);
        showMessage(`${newlyAcquiredPokemon.name} 被直接送到了寶可夢背包。`, 2000);
        hidePokemonFullModal();
        saveGame();
    });

    // 戰鬥結束選項按鈕事件監聽器
    returnToMapButton.addEventListener('click', () => {
        battleEndOptionsModal.classList.add('hidden'); // 隱藏模態視窗
        showScreen('map-selection'); // 返回地圖選擇畫面
    });

    encounterAgainButton.addEventListener('click', () => {
        battleEndOptionsModal.classList.add('hidden'); // 隱藏模態視窗
        if (lastEncounteredWildPokemonId) {
            startBattle(lastEncounteredWildPokemonId); // 再次開始戰鬥
        } else {
            // 這通常不會發生，因為 startBattle 會設置 lastEncounteredWildPokemonId
            showMessage('無法再次遇敵，返回地圖。', 2000);
            showScreen('map-selection');
        }
    });


    // 遊戲開始時調用
    renderMapGrid(); // 先渲染地圖格子，因為它不依賴遊戲狀態
    initializeGame();
});
