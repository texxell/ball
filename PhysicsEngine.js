/**
 * ============================================================================
 * BallRanger.io - PhysicsEngine.js
 * 核心物理與人工智慧決策引擎 (完整生產環境源碼)
 * 檔案版本: 1.0.0
 * 預估總行數: 1800+ 行 (分段輸出第一部分)
 * 語言規範: 使用者界面文字為英文，程式碼註解為 100% 繁體中文 (Traditional Chinese)
 * ============================================================================
 */

// ============================================================================
// 1. 全域數學常數與向量運算系統 (Vector3D & Mathematical Constants)
// ============================================================================

/**
 * 物理引擎專用三維向量類別
 * 提供極致效能的向量運算，避免記憶體垃圾回收 (GC) 造成的卡頓
 */
class Vector3 {
    /**
     * 建立一個三維向量
     * @param {number} x - X 軸分量
     * @param {number} y - Y 軸分量 (在本作中通常代表垂直高度)
     * @param {number} z - Z 軸分量
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 設定向量的數值
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Vector3} 自身以供鏈式調用
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * 複製另一個向量的數值
     * @param {Vector3} v 
     * @returns {Vector3} 自身
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    /**
     * 複製並回傳一個全新的向量物件
     * @returns {Vector3} 新向量
     */
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * 向量加法
     * @param {Vector3} v 
     * @returns {Vector3} 自身
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * 向量加法 (靜態/非破壞性)
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3} 新向量
     */
    static addVectors(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * 向量減法
     * @param {Vector3} v 
     * @returns {Vector3} 自身
     */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    /**
     * 向量減法 (靜態/非破壞性)
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3} 新向量
     */
    static subVectors(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * 向量純量乘法
     * @param {number} scalar 
     * @returns {Vector3} 自身
     */
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * 向量純量除法
     * @param {number} scalar 
     * @returns {Vector3} 自身
     */
    divideScalar(scalar) {
        if (scalar !== 0) {
            const invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    /**
     * 計算向量點積 (Dot Product)
     * @param {Vector3} v 
     * @returns {number} 點積結果
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * 計算向量叉積 (Cross Product)
     * @param {Vector3} v 
     * @returns {Vector3} 自身
     */
    cross(v) {
        const ax = this.x, ay = this.y, az = this.z;
        const bx = v.x, by = v.y, bz = v.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    }

    /**
     * 計算向量叉積 (靜態/非破壞性)
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     * @returns {Vector3} 新向量
     */
    static crossVectors(v1, v2) {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    /**
     * 計算向量長度的平方 (效能優化用，避免 Math.sqrt)
     * @returns {number} 長度平方
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * 計算向量長度
     * @returns {number} 長度
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 將向量單位化 (Normalization)
     * @returns {Vector3} 自身
     */
    normalize() {
        return this.divideScalar(this.length());
    }

    /**
     * 計算與另一個點的距離平方
     * @param {Vector3} v 
     * @returns {number} 距離平方
     */
    distanceToSq(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * 計算與另一個點的距離
     * @param {Vector3} v 
     * @returns {number} 距離
     */
    distanceTo(v) {
        return Math.sqrt(this.distanceToSq(v));
    }

    /**
     * 線性插值 (Lerp)
     * @param {Vector3} v 目標向量
     * @param {number} alpha 插值系數 (0-1)
     * @returns {Vector3} 自身
     */
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }
}

/**
 * 物理引擎核心環境參數配置
 */
const PhysicsConfig = {
    // 碗狀戰場參數
    BOWL_RADIUS: 150.0,            // 碗狀地形的邊緣半徑
    BOWL_DEPTH: 45.0,              // 碗狀地形的中心最大深度
    BASE_GRAVITY: 9.81,            // 基礎重力常數
    TIME_STEP: 1 / 60,             // 物理時鐘步進值 (60FPS)
    AIR_RESISTANCE: 0.015,         // 空氣阻力係數 (隨速度線性衰減)
    BOBBING_SPEED: 0.005,          // 金幣與水晶的浮動動畫速度
    
    // 碰撞與彈性係數
    RESTITUTION_MIN: 0.4,          // 最小彈性係數 (巨型球體)
    RESTITUTION_MAX: 0.85,         // 最大彈性係數 (小型球體敏捷度高)
    FRICTION_COEFF: 0.08,          // 地面滾動摩擦係數
    
    // 數值與機制邊界值
    MIN_BALL_VALUE: 2,             // 球體能被剝離的最小數值
    CRYSTAL_SPLIT_COUNT: 4,        // 被擊中時噴發的金屬黃金水晶數量
    CRYSTAL_VALUE_PERCENT: 0.50,   // 受害者被剝離的精確價值百分比 (50%)
    COIN_REWARD_ELIMINATION: 10,   // 將對手擊落或剝離至毀滅時獲得的重大獎勵金幣數
    COIN_REWARD_NORMAL_COIN: 1,    // 收集地面普通小金幣的基礎收益
    
    // 戰場實體上限控制
    MAX_COINS_ON_ARENA: 60,        // 畫面上同時存在的最大普通金幣數
    MAX_CRYSTALS_ON_ARENA: 40,     // 畫面上同時存在的最大黃金水晶數
    TOTAL_AI_BOTS: 19,             // 本地高智商 AI 機器人總數 (19個機器人 + 1個玩家 = 20人混戰)
    
    // 地形判斷臨界
    VOID_Y_THRESHOLD: -60.0        // 低於此高度則判定掉入虛空死亡
};

// ============================================================================
// 2. 碗狀地形參數化數學運算 (3D Parametric Bowl Physics)
// ============================================================================

/**
 * 碗狀戰場數學模型類別
 * 地形公式：y = D * ((x^2 + z^2) / R^2) - D
 * 當位置在中心 (0,0) 時，高度 y = -D (最低點)
 * 當位置在邊緣 (x^2 + z^2 = R^2) 時，高度 y = 0
 * 超出邊緣後，斜率將急劇增加或直接進入自由落體狀態
 */
class ParametricBowl {
    constructor(radius, depth) {
        this.radius = radius;
        this.radiusSq = radius * radius;
        this.depth = depth;
    }

    /**
     * 根據 X 與 Z 座標計算碗狀地形表面對應的精確 Y 高度
     * @param {number} x 
     * @param {number} z 
     * @returns {number} 碗表面的 Y 高度
     */
    getHeightAt(x, z) {
        const distSq = x * x + z * z;
        // 如果超出了碗的邊緣，則地形不再提供支撐，高度將沿切線或自由落體急劇下降
        if (distSq > this.radiusSq) {
            const excessDist = Math.sqrt(distSq) - this.radius;
            // 邊緣外的陡坡衰減公式，模擬邊緣外部向下捲曲的虛空
            return - (excessDist * excessDist * 0.5);
        }
        // 標準碗內二次元參數方程
        return this.depth * (distSq / this.radiusSq) - this.depth;
    }

    /**
     * 計算球體所在位置的地形法向量 (Surface Normal)
     * 用於計算重力下滑分量以及摩擦力方向
     * 對方程式 y = (D/R^2)*x^2 + (D/R^2)*z^2 - D 求偏導數
     * df/dx = 2*D*x / R^2, df/dz = 2*D*z / R^2, df/dy = -1 (若移項為 f(x,y,z) = y - ...)
     * @param {number} x 
     * @param {number} z 
     * @param {Vector3} targetVector 用於寫入結果的向量，避免重分配記憶體
     */
    getNormalAt(x, z, targetVector) {
        const distSq = x * x + z * z;
        if (distSq > this.radiusSq) {
            // 邊緣外，法向量垂直向上，準備墜入虛空
            targetVector.set(0, 1, 0);
            return targetVector;
        }
        
        // 梯度分量計算
        const dfdx = (2 * this.depth * x) / this.radiusSq;
        const dfdz = (2 * this.depth * z) / this.radiusSq;
        
        // 法向量為 (-dfdx, 1, -dfdz) 並經過單位化
        targetVector.set(-dfdx, 1, -dfdz);
        targetVector.normalize();
        return targetVector;
    }

    /**
     * 判斷指定座標是否已經脫離碗的有效邊緣
     * @param {Vector3} position 
     * @returns {boolean} 是否落入虛空
     */
    isOutOfBounds(position) {
        const distSq = position.x * position.x + position.z * position.z;
        return distSq > this.radiusSq || position.y < PhysicsConfig.VOID_Y_THRESHOLD;
    }
}

// 實例化全域地形物件
const ArenaBowl = new ParametricBowl(PhysicsConfig.BOWL_RADIUS, PhysicsConfig.BOWL_DEPTH);

// ============================================================================
// 3. 戰場實體基類與派生類 (Entities: Spheres, Crystals, Coins)
// ============================================================================

/**
 * 戰場基礎實體類別
 */
class BaseEntity {
    constructor(id, x, y, z) {
        this.id = id;
        this.position = new Vector3(x, y, z);
        this.velocity = new Vector3(0, 0, 0);
        this.radius = 1.0;
        this.isActive = true;
    }

    /**
     * 每幀基礎更新
     * @param {number} dt 
     */
    update(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;
    }
}

/**
 * 滾動球體類別 (Sphere)
 * 涵蓋玩家與 19 個高智商 AI 機器人
 * 核心機制：體積與數值成正比，質量隨數值暴增，導致巨大球體極易因慣性衝出邊緣
 */
class RollingSphere extends BaseEntity {
    /**
     * @param {string|number} id 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} initialValue 初始數值 (例如: 2, 4, 16, 512, 2048)
     * @param {boolean} isAI 是否為機器人
     */
    constructor(id, x, y, z, initialValue = 2, isAI = true) {
        super(id, x, y, z);
        this.isAI = isAI;
        this.value = initialValue;
        this.name = isAI ? `Bot_${id}` : "Player_You";
        
        // 錢包系統
        this.wallet = {
            coins: 0
        };

        // 狀態屬性
        this.isEliminated = false;
        this.invulnerabilityTimer = 0.0; // 剛被剝離後的短暫無敵免疫時間 (秒)
        
        // 暫存向量物件，防止高頻率物理運算時產生 GC
        this._surfaceNormal = new Vector3();
        this._gravityForce = new Vector3();
        this._steeringForce = new Vector3();

        // 根據數值動態重新計算物理特徵參數
        this.recalculateAttributes();
    }

    /**
     * 核心數學縮放公式：根據球體當前價值數值，動態計算其半徑、質量、敏捷度與碰撞係數
     * 小球 (例如數值 2-16)：質量極小 (1.0-2.5), 敏捷度極高 (轉向力強), 摩擦與彈性高。
     * 大球 (例如數值 512-2048)：質量呈指數級增長，半徑巨大，慣性龐大，極易因漂移甩出邊緣。
     */
    recalculateAttributes() {
        // 半徑公式：以對數為基礎，防止大數值球體遮蔽整個螢幕
        // 數值 2 -> 半徑約 1.2, 數值 2048 -> 半徑約 5.5
        this.radius = 0.8 + Math.log2(this.value) * 0.45;

        // 質量公式：質量隨體積呈非線性增長，決定了撞擊時的動量交換
        // 數值 2 的質量為 1.0; 數值 2048 的質量可高達 150.0
        this.mass = 0.5 + Math.pow(this.value, 0.72) * 0.6;

        // 敏捷度/轉向控制力：體積越大，控制力越弱。這使得巨型球體在碗外圍陡坡極難回頭
        this.steeringAgility = Math.max(8.0, 45.0 - Math.log2(this.value) * 3.5);

        // 最高移動速度限制：大球極速略低，但衝力恐怖
        this.maxSpeed = Math.max(12.0, 28.0 - Math.log2(this.value) * 1.5);

        // 彈性係數：大球比較沉重，彈性低；小球活潑，彈性高
        const t = Math.min(1.0, Math.log2(this.value) / 11); // 11 對應 2048
        this.restitution = PhysicsConfig.RESTITUTION_MAX - t * (PhysicsConfig.RESTITUTION_MAX - PhysicsConfig.RESTITUTION_MIN);
    }

    /**
     * 套用外部輸入的操控方向力 (玩家鍵盤/滑鼠或 AI 決策輸入)
     * @param {Vector3} direction 操控輸入的單位方向向量
     */
    applySteering(direction) {
        if (!direction || direction.lengthSq() < 0.01) return;
        
        // 確保輸入向量已單位化
        const dir = direction.clone().normalize();
        
        // 根據球體自身的敏捷度計算當前步進應該施加的驅動力
        this._steeringForce.copy(dir).multiplyScalar(this.steeringAgility);
        
        // 驅動力直接疊加至速度分量中
        this.velocity.add(this._steeringForce);
    }

    /**
     * 球體核心物理循環：計算碗狀引力、坡度阻力、速度上限限制、以及高度同步
     */
    updatePhysics(dt) {
        if (this.isEliminated) return;

        // 1. 遞減無敵時間
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= dt;
        }

        // 2. 獲取當前位置的地形法向量
        ArenaBowl.getNormalAt(this.position.x, this.position.z, this._surfaceNormal);

        // 3. 計算碗狀地形重力下滑力
        // 基礎重力垂直向下 (0, -G, 0)，將其投影到地形切平面
        // 下滑加速度公式：a_gravity = G * sin(theta) -> 沿著斜面向下
        // 在此直接使用重力向量與法向量的交互作用來計算沿斜面的加速分量
        this._gravityForce.set(0, -PhysicsConfig.BASE_GRAVITY, 0);
        const dotProd = this._gravityForce.dot(this._surfaceNormal);
        
        // 地形支持力抵消了垂直於表面的重力，留下沿斜面向下的分量
        this._gravityForce.x -= this._surfaceNormal.x * dotProd;
        this._gravityForce.y -= this._surfaceNormal.y * dotProd;
        this._gravityForce.z -= this._surfaceNormal.z * dotProd;

        // 重力加速度直接作用於速度 (與質量無關，自由落體等效性)
        this.velocity.add(this._gravityForce.multiplyScalar(dt));

        // 4. 套用滾動摩擦力與空氣阻力
        // 空氣阻力與速度成正比，摩擦力與地形支持力有關（在此簡化為與速度反向的線性衰減）
        const dragFactor = 1.0 - (PhysicsConfig.AIR_RESISTANCE + PhysicsConfig.FRICTION_COEFF) * dt;
        this.velocity.multiplyScalar(dragFactor);

        // 5. 限制最大速度限制 (防止碰撞或重力加速度導致數值溢出崩潰)
        const currentSpeed = this.velocity.length();
        if (currentSpeed > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // 6. 應用速度更新三維座標位置
        this.position.x += this.velocity.x * dt;
        this.position.z += this.velocity.z * dt;

        // 7. 將球體的 Y 軸高度精確鎖定在碗狀參數地形表面上 (貼地滾動)
        const targetY = ArenaBowl.getHeightAt(this.position.x, this.position.z);
        
        // 如果還沒掉出碗外，鎖定 Y 軸；如果出了碗外，切換為真實三維自由落體
        const distSq = this.position.x * this.position.x + this.position.z * this.position.z;
        if (distSq <= ArenaBowl.radiusSq) {
            this.position.y = targetY;
        } else {
            // 邊緣外，Y 軸不再受地形支持，承受純重力下墜
            this.velocity.y -= PhysicsConfig.BASE_GRAVITY * dt;
            this.position.y += this.velocity.y * dt;
        }

        // 8. 邊緣虛空死亡判定
        if (ArenaBowl.isOutOfBounds(this.position)) {
            this.eliminate();
        }
    }

    /**
     * 球體掉落虛空或價值被抽乾時觸發消除
     */
    eliminate() {
        this.isEliminated = true;
        this.isActive = false;
        this.velocity.set(0, 0, 0);
        // 此處將由中央引擎捕捉並觸發重生或結算邏輯
    }
}

/**
 * 3D 金屬黃金水晶實體類別 (Crystal Entity)
 * 當大球重擊小球時，從小球精確剝離 50% 的數值，並平均分配給 4 個噴發出的水晶
 */
class GoldCrystal extends BaseEntity {
    /**
     * @param {number} id 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} value 水晶內含的精確數值分數
     */
    constructor(id, x, y, z, value) {
        super(id, x, y, z);
        this.value = value;
        this.radius = 0.65; // 水晶碰撞體積固定
        this.creationTime = Date.now();
        this.baseY = y;     // 用於記錄基準高度以實現上下浮動效果
        
        // 給予水晶一個向外噴散的初始隨機水平初速度
        const angle = Math.random() * Math.PI * 2;
        const speed = 4.5 + Math.random() * 3.5;
        this.velocity.set(Math.cos(angle) * speed, 2.0, Math.sin(angle) * speed);
    }

    /**
     * 水晶物理更新：包含噴散時的減速以及貼地浮動動畫
     */
    update(dt) {
        if (!this.isActive) return;

        // 水平速度因為與地面摩擦而迅速衰減，最終靜止等待玩家收集
        this.velocity.x *= 0.90;
        this.velocity.z *= 0.90;
        
        this.position.x += this.velocity.x * dt;
        this.position.z += this.velocity.z * dt;

        // 確保水晶維持在碗表面上方
        const groundY = ArenaBowl.getHeightAt(this.position.x, this.position.z);
        this.baseY = groundY + 0.5; // 基準高度維持在地面上方 0.5 單位

        // 實現精美的 3D 金屬水晶上下浮動特效動畫
        const timeOffset = Date.now() * PhysicsConfig.BOBBING_SPEED;
        this.position.y = this.baseY + Math.sin(timeOffset + this.id) * 0.25;

        // 若不慎噴出碗外，直接消失
        if (this.position.x * this.position.x + this.position.z * this.position.z > ArenaBowl.radiusSq) {
            this.isActive = false;
        }
    }
}

/**
 * 3D 隨機小金幣實體類別 (Coin Entity)
 * 散落於戰場各處，提供基礎額外收益，每枚價值精確 +1 金幣
 */
class GoldCoin extends BaseEntity {
    constructor(id, x, z) {
        // 金幣永遠完美生成在地形表面
        const y = ArenaBowl.getHeightAt(x, z);
        super(id, x, y, z);
        this.radius = 0.45;
        this.baseY = y + 0.3;
        this.isActive = true;
    }

    /**
     * 金幣原地旋轉與規律浮動更新
     */
    update(dt) {
        if (!this.isActive) return;
        const timeOffset = Date.now() * (PhysicsConfig.BOBBING_SPEED * 1.2);
        this.position.y = this.baseY + Math.cos(timeOffset + this.id) * 0.15;
    }
}

// ============================================================================
// 4. 20人高智商 AI 決策系統 (High-IQ AI Steering & Routine Trees)
// ============================================================================

/**
 * 戰場 AI 導航與戰術決策大腦
 * 完美實作 Match 1 (教學無攻擊模式) 與 Match 2+ (極度殘暴切肉追獵模式)
 */
class IntelligenceDirector {
    constructor() {
        this.currentMatchLevel = 1; // 預設為教學模式，隨後由外部主程式動態設定
        this.scanningRadius = 60.0; // AI 掃描周遭威脅與目標的極限視距
        
        // 內部文字提示緩衝區
        this.activePopupText = "";
        this.popupTimer = 0.0;
    }

    /**
     * 設定目前比賽場次模式
     * @param {number} matchNumber 
     */
    setMatchLevel(matchNumber) {
        this.currentMatchLevel = matchNumber;
    }

    /**
     * 觸發純英文教學彈出提示語句 (English guidelines)
     * @param {string} text 
     */
    triggerTutorialPopup(text) {
        this.activePopupText = text;
        this.popupTimer = 4.0; // 顯示4秒
    }

    /**
     * 為指定的 AI 球體計算當前幀的最佳戰術驅動方向向量
     * @param {RollingSphere} aiBall 目前正在進行決策的 AI 實體
     * @param {Array<RollingSphere>} allBalls 戰場全體球體列表 (包含玩家)
     * @param {Array<GoldCrystal>} crystals 戰場全部黃金水晶
     * @param {Array<GoldCoin>} coins 戰場全部普通金幣
     * @returns {Vector3} 計算得出的操控輸入方向 (已單位化)
     */
    computeTacticalDecision(aiBall, allBalls, crystals, coins) {
        const decisionDirection = new Vector3(0, 0, 0);
        if (aiBall.isEliminated) return decisionDirection;

        // --------------------------------------------------------------------
        // 第一層級：Match 1 教學模式分支
        // --------------------------------------------------------------------
        if (this.currentMatchLevel === 1) {
            // 教學模式下，AI 絕對不主動發起進攻。它們只會在場中緩慢徘徊，甚至故意引導玩家去吞噬它們。
            // 尋找最近的小金幣或水晶
            let closestItem = null;
            let minDist = Infinity;

            for (let i = 0; i < crystals.length; i++) {
                if (!crystals[i].isActive) continue;
                const dist = aiBall.position.distanceToSq(crystals[i].position);
                if (dist < minDist) {
                    minDist = dist;
                    closestItem = crystals[i];
                }
            }

            if (!closestItem) {
                for (let i = 0; i < coins.length; i++) {
                    if (!coins[i].isActive) continue;
                    const dist = aiBall.position.distanceToSq(coins[i].position);
                    if (dist < minDist) {
                        minDist = dist;
                        closestItem = coins[i];
                    }
                }
            }

            if (closestItem) {
                // 向該和平目標移動
                decisionDirection.copy(closestItem.position).sub(aiBall.position);
                decisionDirection.y = 0; // 僅在水平面上導航
                decisionDirection.normalize();
            } else {
                // 如果場面上空無一物，向中心點微速靠攏，避免掉落
                decisionDirection.copy(aiBall.position).multiplyScalar(-1);
                decisionDirection.y = 0;
                decisionDirection.normalize();
            }

            return decisionDirection;
        }

        // --------------------------------------------------------------------
        // 第二層級：Match 2+ 全面切肉殘暴對抗模式分支
        // --------------------------------------------------------------------
        // 核心演算法：根據自身體積(Value)與周遭實體的強弱對比，切換為「逃跑掠奪者」或「邊緣處刑者」
        
        let deadliestThreat = null;
        let threatMaxMass = -1;
        let threatMinDistSq = Infinity;

        let premiumTarget = null;
        let targetMinDistSq = Infinity;

        // 1. 掃描戰場所有球體，區分威脅與獵物
        for (let i = 0; i < allBalls.length; i++) {
            const other = allBalls[i];
            if (other.id === aiBall.id || other.isEliminated) continue;

            const distSq = aiBall.position.distanceToSq(other.position);
            
            // 忽略超出視距的球體
            if (distSq > this.scanningRadius * this.scanningRadius) continue;

            // 如果對方的價值大於自己，且不處於無敵狀態，判定為致命威脅
            if (other.value > aiBall.value && other.invulnerabilityTimer <= 0) {
                if (other.mass > threatMaxMass || distSq < threatMinDistSq) {
                    threatMaxMass = other.mass;
                    threatMinDistSq = distSq;
                    deadliestThreat = other;
                }
            } 
            // 如果自己是大球，對方是小球，且小球沒無敵，判定為可撞擊榨乾的肥美獵物
            else if (aiBall.value > other.value && other.invulnerabilityTimer <= 0) {
                if (distSq < targetMinDistSq) {
                    targetMinDistSq = distSq;
                    premiumTarget = other;
                }
            }
        }

        // 2. 決策樹邏輯判定
        // 狀況 A：遭遇緊急威脅 (小球遇到大球接近) -> 執行最高優先級逃跑路徑計算
        if (deadliestThreat && threatMinDistSq < 35 * 35) {
            // 逃跑向量：從威脅點指向自身的向量
            const escapeVec = Vector3.subVectors(aiBall.position, deadliestThreat.position);
            escapeVec.y = 0;
            escapeVec.normalize();

            // 深度優化：避免盲目逃跑導致自己衝出碗的邊緣！
            // 預判如果繼續往逃跑方向走，是否會接近危險邊緣
            const futurePos = aiBall.position.clone().add(escapeVec.clone().multiplyScalar(6.0));
            const futureDistFromCenterSq = futurePos.x * futurePos.x + futurePos.z * futurePos.z;
            
            if (futureDistFromCenterSq > ArenaBowl.radiusSq * 0.85) {
                // 如果逃跑方向會導致衝出懸崖，將逃跑方向沿著碗邊緣進行 90 度切線側切側滑
                const centerVec = new Vector3(-aiBall.position.x, 0, -aiBall.position.z).normalize();
                // 混合向心力與側向力
                escapeVec.copy(centerVec).add(new Vector3(-escapeVec.z, 0, escapeVec.x)).normalize();
            }

            decisionDirection.copy(escapeVec);
            return decisionDirection.normalize();
        }

        // 狀況 B：自身是高價值巨型球體 (例如 value >= 256) -> 啟動「邊緣處刑者」AI 策略
        // 策略詳解：主動計算攔截軌跡，將小球往碗的陡峭邊緣角落逼迫，利用巨大動量將其砸下深淵
        if (aiBall.value >= 256 && premiumTarget) {
            // 計算攔截點 (考慮到對方的速度，做簡單的前置量預判)
            const leadTime = Math.sqrt(targetMinDistSq) / aiBall.maxSpeed;
            const interceptedPos = premiumTarget.position.clone().add(premiumTarget.velocity.clone().multiplyScalar(leadTime));
            
            // 逼迫方向向量
            const attackVec = Vector3.subVectors(interceptedPos, aiBall.position);
            attackVec.y = 0;
            attackVec.normalize();
            
            // 額外戰術加權：如果獵物已經在邊緣附近，AI 會特意調整角度，繞到獵物靠中心的一側，確保撞擊方向指向碗外
            const targetDistFromCenterSq = premiumTarget.position.x * premiumTarget.position.x + premiumTarget.position.z * premiumTarget.position.z;
            if (targetDistFromCenterSq > ArenaBowl.radiusSq * 0.5) {
                const outPushVec = premiumTarget.position.clone().normalize(); // 指向碗外
                attackVec.add(outPushVec.multiplyScalar(0.4)).normalize();
            }

            decisionDirection.copy(attackVec);
            return decisionDirection.normalize();
        }

        // 狀況 C：中小型球體，周遭安全 -> 專注於全速瘋狂搜尋、搶奪金屬黃金水晶與地面金幣
        let closestTreasure = null;
        let treasureMinDistSq = Infinity;

        // 優先搶奪高價值的噴發黃金水晶
        for (let i = 0; i < crystals.length; i++) {
            if (!crystals[i].isActive) continue;
            const dSq = aiBall.position.distanceToSq(crystals[i].position);
            if (dSq < treasureMinDistSq) {
                treasureMinDistSq = dSq;
                closestTreasure = crystals[i];
            }
        }

        // 若無水晶，則退而求其次尋找普通小金幣
        if (!closestTreasure) {
            for (let i = 0; i < coins.length; i++) {
                if (!coins[i].isActive) continue;
                const dSq = aiBall.position.distanceToSq(coins[i].position);
                if (dSq < treasureMinDistSq) {
                    treasureMinDistSq = dSq;
                    closestTreasure = coins[i];
                }
            }
        }

        // 如果找到了寶藏目標，全速奔襲
        if (closestTreasure) {
            decisionDirection.copy(closestTreasure.position).sub(aiBall.position);
            decisionDirection.y = 0;
            return decisionDirection.normalize();
        }

        // 狀況 D：完全無事可做或處於死角 -> 保持在碗底中心安全區域熱身徘徊
        const distToCenter = Math.sqrt(aiBall.position.x * aiBall.position.x + aiBall.position.z * aiBall.position.z);
        if (distToCenter > ArenaBowl.radiusFundament * 0.3) {
            // 游向中心點
            decisionDirection.set(-aiBall.position.x, 0, -aiBall.position.z).normalize();
        } else {
            // 漫無目的的小幅度巡航
            const wanderAngle = (Date.now() * 0.002) + aiBall.id;
            decisionDirection.set(Math.cos(wanderAngle), 0, Math.sin(wanderAngle)).normalize();
        }

        return decisionDirection.normalize();
    }
}

// 實例化全域 AI 指揮官大腦
const AIDirector = new IntelligenceDirector();
// ============================================================================
// 5. 核心碰撞檢測、動量交換與數值剝離噴發系統 (Collision & Stripping Mechanism)
// ============================================================================

/**
 * 處理球體與球體之間的彈性/非彈性碰撞運動學，以及獨創的「50% 數值剝離與水晶生成」靈魂機制
 * @param {RollingSphere} ballA 第一個球體
 * @param {RollingSphere} ballB 第二個球體
 * @param {Array<GoldCrystal>} globalCrystals 外部全域水晶儲存陣列，用於直接推入新生成的水晶
 * @param {function} onEliminationCallback 當小球被完全榨乾小於臨界值消亡時的外部回呼函數
 */
function resolveSphereCollision(ballA, ballB, globalCrystals, onEliminationCallback) {
    if (ballA.isEliminated || ballB.isEliminated) return;

    // 1. 計算兩者中心點的相對位移向量
    const deltaX = ballB.position.x - ballA.position.x;
    const deltaY = ballB.position.y - ballA.position.y;
    const deltaZ = ballB.position.z - ballA.position.z;
    
    const distanceSq = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
    const minDistance = ballA.radius + ballB.radius;

    // 若距離平方大於半徑和的平方，代表未發生碰撞，直接跳出
    if (distanceSq >= minDistance * minDistance) return;

    const distance = Math.sqrt(distanceSq);
    if (distance === 0) return; // 防止極端除以零異常

    // 2. 幾何位置修正 (Positional Correction) - 防止兩球因穿插而卡死黏在一起
    const overlap = minDistance - distance;
    // 穿透修正權重 (百分之比分流)
    const correctionX = (deltaX / distance) * overlap * 0.5;
    const correctionY = (deltaY / distance) * overlap * 0.5;
    const correctionZ = (deltaZ / distance) * overlap * 0.5;

    // 依據質量反比分配位移修正量，質量大者位移小
    const totalMass = ballA.mass + ballB.mass;
    const ratioA = ballB.mass / totalMass;
    const ratioB = ballA.mass / totalMass;

    ballA.position.x -= correctionX * ratioA * 1.1;
    ballA.position.y -= correctionY * ratioA * 1.1;
    ballA.position.z -= correctionZ * ratioA * 1.1;

    ballB.position.x += correctionX * ratioB * 1.1;
    ballB.position.y += correctionY * ratioB * 1.1;
    ballB.position.z += correctionZ * ratioB * 1.1;

    // 3. 彈性碰撞動量交換數學計算 (Elastic Collision Normal Impulse)
    // 建立法線單位向量
    const nx = deltaX / distance;
    const ny = deltaY / distance;
    const nz = deltaZ / distance;

    // 計算相對速度在法線方向上的投影 (Relative Velocity)
    const rvx = ballB.velocity.x - ballA.velocity.x;
    const rvy = ballB.velocity.y - ballA.velocity.y;
    const rvz = ballB.velocity.z - ballA.velocity.z;

    const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

    // 如果兩球已經在互相分離 (相對速度大於零)，則不重複施加衝量
    if (velAlongNormal > 0) return;

    // 混合兩者的還原彈性係數 (Restitution)
    const mixedRestitution = Math.min(ballA.restitution, ballB.restitution);

    // 計算衝量純量值 J
    // Impulse Formula: j = -(1 + e) * (V_rel . n) / (1/m_a + 1/m_b)
    let impulseScalar = -(1 + mixedRestitution) * velAlongNormal;
    impulseScalar /= (1 / ballA.mass + 1 / ballB.mass);

    // 套用衝量至雙方速度分量
    ballA.velocity.x -= (impulseScalar / ballA.mass) * nx;
    ballA.velocity.y -= (impulseScalar / ballA.mass) * ny;
    ballA.velocity.z -= (impulseScalar / ballA.mass) * nz;

    ballB.velocity.x += (impulseScalar / ballB.mass) * nx;
    ballB.velocity.y += (impulseScalar / ballB.mass) * ny;
    ballB.velocity.z += (impulseScalar / ballB.mass) * nz;

    // ------------------------------------------------------------------------
    // 4. 核心靈魂機制：數值大欺負數值小，觸發精確 50% 剝離與黃金水晶噴發
    // ------------------------------------------------------------------------
    // 定義何謂顯著的侵略撞擊：相對速度必須超過一定閾值，且兩者價值不能相等
    const strikeIntensity = Math.abs(velAlongNormal);
    if (strikeIntensity > 1.5 && ballA.value !== ballB.value) {
        
        // 判定誰是大球(侵略者)，誰是小球(受害者)
        let attacker = ballA.value > ballB.value ? ballA : ballB;
        let victim = ballA.value > ballB.value ? ballB : ballA;

        // 如果受害者當前正處於剛被剝離後的無敵免疫期，則免受二次剝離
        if (victim.invulnerabilityTimer <= 0 && victim.value >= PhysicsConfig.MIN_BALL_VALUE) {
            
            // 計算精確剝離總額 (精確 50%)
            const originalValue = victim.value;
            const strippedTotal = Math.floor(originalValue * PhysicsConfig.CRYSTAL_VALUE_PERCENT);
            
            if (strippedTotal > 0) {
                // 扣除受害者的數值
                victim.value -= strippedTotal;
                
                // 重新計算因為價值改變帶來的質量與半徑縮放
                victim.recalculateAttributes();

                // 賦予受害者短暫的防連續虐待保護期 (1.5秒無敵)
                victim.invulnerabilityTimer = 1.5;

                // 將剝離出的價值完美平分至 4 個實體黃金金屬水晶中
                const singleCrystalValue = Math.floor(strippedTotal / PhysicsConfig.CRYSTAL_SPLIT_COUNT);
                const remainder = strippedTotal % PhysicsConfig.CRYSTAL_SPLIT_COUNT;

                // 以相撞中心點為基準，向四周扇形放射狀噴發 3D 水晶
                for (let k = 0; k < PhysicsConfig.CRYSTAL_SPLIT_COUNT; k++) {
                    const crystalId = `crystal_${Date.now()}_${Math.random()}`;
                    
                    // 碰撞發生的大致交界點
                    const spawnX = (ballA.position.x + ballB.position.x) * 0.5 + (Math.random() - 0.5) * 2.0;
                    const spawnZ = (ballA.position.z + ballB.position.z) * 0.5 + (Math.random() - 0.5) * 2.0;
                    const spawnY = ArenaBowl.getHeightAt(spawnX, spawnZ);

                    // 最後一個水晶吞掉因整除產生的餘數碎屑
                    const finalValue = (k === PhysicsConfig.CRYSTAL_SPLIT_COUNT - 1) ? (singleCrystalValue + remainder) : singleCrystalValue;

                    if (finalValue > 0) {
                        const newCrystal = new GoldCrystal(crystalId, spawnX, spawnY, spawnZ, finalValue);
                        globalCrystals.push(newCrystal);
                    }
                }

                // 檢查受害者是否因為被抽乾而低於生存極限
                if (victim.value < PhysicsConfig.MIN_BALL_VALUE) {
                    victim.eliminate();
                    // 觸發擊殺獎勵回呼，將由中央處理器清算給侵略者大球的錢包
                    if (onEliminationCallback) {
                        onEliminationCallback(attacker, victim);
                    }
                }
            }
        }
    }
}

/**
 * 處理單一球體與場面上所有散落金幣/水晶的拾取判定與財富增長
 * @param {RollingSphere} ball 正在檢測的球體
 * @param {Array<GoldCoin>} globalCoins 戰場普通金幣陣列
 * @param {Array<GoldCrystal>} globalCrystals 戰場黃金水晶陣列
 */
function resolveItemCollection(ball, globalCoins, globalCrystals) {
    if (ball.isEliminated) return;

    // 1. 金幣收集檢測
    for (let i = 0; i < globalCoins.length; i++) {
        const coin = globalCoins[i];
        if (!coin.isActive) continue;

        // 計算三維球體與金幣的距離
        const dx = ball.position.x - coin.position.x;
        const dy = ball.position.y - coin.position.y;
        const dz = ball.position.z - coin.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        const collectionRadius = ball.radius + coin.radius;

        // 若發生重疊，代表成功吸入金幣
        if (distSq < collectionRadius * collectionRadius) {
            coin.isActive = false; // 標記銷毀
            
            // 錢包精確增加 1 枚金幣硬幣
            ball.wallet.coins += PhysicsConfig.COIN_REWARD_NORMAL_COIN;
        }
    }

    // 2. 剝離水晶收集檢測
    for (let j = 0; j < globalCrystals.length; j++) {
        const crystal = globalCrystals[j];
        if (!crystal.isActive) continue;

        const dx = ball.position.x - crystal.position.x;
        const dy = ball.position.y - crystal.position.y;
        const dz = ball.position.z - crystal.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        const collectionRadius = ball.radius + crystal.radius;

        if (distSq < collectionRadius * collectionRadius) {
            crystal.isActive = false; // 標記銷毀
            
            // 水晶不增加錢包金幣，而是直接注入球體核心，直接增加其球體價值與體積！
            ball.value += crystal.value;
            
            // 由於體積價值暴增，必須即時重新分配其物理慣材質量與半徑大小
            ball.recalculateAttributes();
        }
    }
}

// ============================================================================
// 6. 戰場動態物件生態池生成器 (Currency Spawning & Arena Maintenance)
// ============================================================================

/**
 * 管理與維護整個戰場的地圖物件刷新率，確保資源充沛且不超出性能上限
 */
class ArenaResourceSpawner {
    constructor() {
        this.lastCoinSpawnTime = 0;
        this.coinSpawnInterval = 1500; // 每 1.5 秒嘗試補給普通金幣
    }

    /**
     * 在碗狀地形的有效表面範圍內，隨機選取並生成一個分佈均勻的二維座標點
     * @returns {Vector3} 返回位於地形表面的隨機三維點
     */
    generateRandomSurfacePoint() {
        // 使用極座標系均勻分佈公式，防止隨機點在中心點過度紮堆
        const r = Math.sqrt(Math.random()) * (PhysicsConfig.BOWL_RADIUS * 0.9); // 留出 10% 邊緣緩衝
        const theta = Math.random() * Math.PI * 2;
        
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = ArenaBowl.getHeightAt(x, z);

        return new Vector3(x, y, z);
    }

    /**
     * 每一幀的計時維護更新，監控金幣池總量並自動填補空缺
     * @param {Array<GoldCoin>} globalCoins 
     */
    maintainPopulation(globalCoins) {
        // 過濾掉已經失效被吃掉的金幣
        let activeCount = 0;
        for (let i = 0; i < globalCoins.length; i++) {
            if (globalCoins[i].isActive) activeCount++;
        }

        const now = Date.now();
        if (now - this.lastCoinSpawnTime > this.coinSpawnInterval) {
            // 如果當前金幣低於設定上限，立刻批量補齊空缺
            if (activeCount < PhysicsConfig.MAX_COINS_ON_ARENA) {
                const spawnsNeeded = Math.min(5, PhysicsConfig.MAX_COINS_ON_ARENA - activeCount);
                for (let k = 0; k < spawnsNeeded; k++) {
                    const point = this.generateRandomSurfacePoint();
                    const coinId = `coin_${now}_${Math.random()}`;
                    const newCoin = new GoldCoin(coinId, point.x, point.z);
                    globalCoins.push(newCoin);
                }
            }
            this.lastCoinSpawnTime = now;
        }
    }
}

// 實例化全域生態生成器
const GlobalSpawner = new ArenaResourceSpawner();

// ============================================================================
// 7. 中央全域物理模擬與控制管線核心 (The Main Loops Dispatcher)
// ============================================================================

/**
 * BallRanger.io 物理與 AI 的最高調度總指揮官類別
 * 承載 20 個玩家與 AI 對象的統合、宏觀碰撞管線、多場次模式調校、以及 UI 英文引導派發
 */
class PhysicsEngineController {
    constructor() {
        this.spheres = [];
        this.coins = [];
        this.crystals = [];
        this.playerRef = null;
        
        // 歷史死亡清單，用於重生排隊
        this.eliminatedRegistry = new Map();
    }

    /**
     * 初始化一個全新的對局，配置 1 個玩家與 19 個高智商 AI 機器人
     * @param {number} matchLevel 場次級別 (1 代表教學，2+ 代表切肉殘暴模式)
     */
    initializeMatch(matchLevel = 1) {
        this.spheres = [];
        this.coins = [];
        this.crystals = [];
        this.eliminatedRegistry.clear();

        // 設置 AI 指揮官的殘暴度級別
        AIDirector.setMatchLevel(matchLevel);

        // 1. 創立核心玩家實體 (You) - 置於中軸偏後安全起點
        const player = new RollingSphere("player_0", 0, ArenaBowl.getHeightAt(0, 30), 30, 16, false);
        this.spheres.push(player);
        this.playerRef = player;

        // 2. 批量配置 19 名具備獨立戰術大腦的 AI 機器人夥伴
        for (let i = 1; i <= PhysicsConfig.TOTAL_AI_BOTS; i++) {
            // 將 AI 均勻環繞散落分佈在碗底周圍，初始大小賦予隨機階梯 (從 2 到 64 不等，模擬殘酷生態場)
            const angle = (i / PhysicsConfig.TOTAL_AI_BOTS) * Math.PI * 2;
            const radiusDist = 40.0 + Math.random() * 50.0;
            const spawnX = radiusDist * Math.cos(angle);
            const spawnZ = radiusDist * Math.sin(angle);
            const spawnY = ArenaBowl.getHeightAt(spawnX, spawnZ);

            // 隨機初始價值階梯分配：10% 機率是全場夢魘級別大球，40% 中球，50% 敏捷小基層球
            let initialValue = 4;
            const roll = Math.random();
            if (roll > 0.90) {
                initialValue = 512;
            } else if (roll > 0.50) {
                initialValue = 64;
            } else if (roll > 0.20) {
                initialValue = 16;
            }

            const aiBot = new RollingSphere(i, spawnX, spawnY, spawnZ, initialValue, true);
            this.spheres.push(aiBot);
        }

        // 3. 初始地圖普通金幣預先鋪滿
        for (let k = 0; k < PhysicsConfig.MAX_COINS_ON_ARENA * 0.6; k++) {
            const pt = GlobalSpawner.generateRandomSurfacePoint();
            const coinId = `coin_init_${k}`;
            this.coins.push(new GoldCoin(coinId, pt.x, pt.z));
        }

        // 4. 若為 Match 1，即刻在螢幕中央鳴發純英文新手教學引導語句
        if (matchLevel === 1) {
            AIDirector.triggerTutorialPopup("WELCOME TO BALLRANGER.IO! TUTORIAL MODE: AI bots are passive. Roll and smash smaller balls to strip 50% of their values!");
        }
    }

    /**
     * 物理世界核心心跳時鐘主迴圈 (Main Physics Heartbeat Loop)
     * 外部主渲染循環 (requestAnimationFrame) 必須在每幀調用此方法並傳入精確的 dt 差值
     * @param {number} deltaTime 兩幀之間的時間差 (秒)
     * @param {Vector3} playerInputDirection 外部硬體層捕獲到的玩家搖桿/鍵盤輸入操作方向
     */
    stepWorld(deltaTime, playerInputDirection) {
        // 防止過大的 deltaTime 導致物理穿透崩潰 (例如網頁標籤切換後返回)
        const dt = Math.min(deltaTime, 0.033);

        // 1. 維護並刷新地圖普通金幣生態總量
        GlobalSpawner.maintainPopulation(this.coins);

        // 2. 更新所有黃金水晶、普通金幣的浮動特效與基礎衰減
        for (let i = 0; i < this.crystals.length; i++) {
            if (this.crystals[i].isActive) this.crystals[i].update(dt);
        }
        for (let i = 0; i < this.coins.length; i++) {
            if (this.coins[i].isActive) this.coins[i].update(dt);
        }

        // 3. 收集操控輸入並應用物理
        for (let i = 0; i < this.spheres.length; i++) {
            const ball = this.spheres[i];
            if (ball.isEliminated) continue;

            if (!ball.isAI) {
                // 玩家本體：套用硬體層真實輸入的方向
                ball.applySteering(playerInputDirection);
            } else {
                // AI 機器人：透過決策樹神經網網絡，動態算出當前幀的最佳宏觀戰術輸入方向
                const aiSteer = AIDirector.computeTacticalDecision(ball, this.spheres, this.crystals, this.coins);
                ball.applySteering(aiSteer);
            }

            // 更新重力、摩擦力、鎖定高度等底層碗狀積分數學
            ball.updatePhysics(dt);
        }

        // 4. 高頻率宏觀雙重碰撞檢測管線 (O(N^2) 雙迴圈精確碰撞隔離)
        for (let i = 0; i < this.spheres.length; i++) {
            const ballA = this.spheres[i];
            if (ballA.isEliminated) continue;

            // A. 球體與球體碰撞檢測與動量交換
            for (let j = i + 1; j < this.spheres.length; j++) {
                const ballB = this.spheres[j];
                resolveSphereCollision(ballA, ballB, this.crystals, (attacker, victim) => {
                    // 此處為剝離消亡/完全擊碎時的回呼
                    // 被完全榨乾淘汰，侵略者大球立即獲得重大擊殺清算獎勵：直接往錢包注入 10 枚金幣
                    attacker.wallet.coins += PhysicsConfig.COIN_REWARD_ELIMINATION;
                    
                    // 如果被消亡的是玩家本體，發送英文死亡清算通知
                    if (!victim.isAI) {
                        AIDirector.triggerTutorialPopup("GAME OVER! You were stripped into cosmic dust. Restarting match...");
                    } else if (!attacker.isAI) {
                        AIDirector.triggerTutorialPopup("GREAT STRIP KILLS! +10 Gold Bonus credited directly to your wallet.");
                    }
                });
            }

            // B. 球體與地圖靜態金幣/水晶的拾取判定
            resolveItemCollection(ballA, this.coins, this.crystals);
        }

        // 5. 例行維護清理：移除已經被吞噬或無效的垃圾項目，保持內存整潔高效
        this.crystals = this.crystals.filter(c => c.isActive);
        this.coins = this.coins.filter(c => c.isActive);

        // 6. 處理掉落虛空死亡後的 AI 機器人異步自動復活冷卻佇列
        this.processBotRespawns();

        // 7. 減緩教學導引提示語的計時器
        if (AIDirector.popupTimer > 0) {
            AIDirector.popupTimer -= dt;
            if (AIDirector.popupTimer <= 0) {
                AIDirector.activePopupText = "";
            }
        }
    }

    /**
     * 處理那些不幸掉下深淵邊緣的 AI 機器人重生計制，確保競技場永遠維持 20 人大混戰
     */
    processBotRespawns() {
        const now = Date.now();
        
        for (let i = 0; i < this.spheres.length; i++) {
            const ball = this.spheres[i];
            
            // 如果發現死掉的球體，且尚未註冊進死亡復活冷卻隊列，則將其推入
            if (ball.isEliminated && !this.eliminatedRegistry.has(ball.id)) {
                
                // 如果是玩家死掉，則由外部遊戲主流程控制器決定何時調用 initializeMatch 重啟，AI 則在這裡自動復活
                if (ball.isAI) {
                    this.eliminatedRegistry.set(ball.id, now + 4000); // 4 秒後原位或隨機復活
                    
                    // 如果是被玩家推落懸崖致死的，在此追加重大回饋獎勵
                    if (this.playerRef && !this.playerRef.isEliminated) {
                        // 判定是否為玩家的撞擊導致其飛出邊緣 (簡化為：當玩家存活，且有人死亡時，給予玩家正向激勵)
                        // 在此直接為玩家錢包發放 10 金幣
                        this.playerRef.wallet.coins += PhysicsConfig.COIN_REWARD_ELIMINATION;
                    }
                }
            }
        }

        // 遍歷死亡註冊名單，時間一到，原地滿血復活
        this.eliminatedRegistry.forEach((respawnTime, botId) => {
            if (now >= respawnTime) {
                // 尋找對應的球體對象
                const deadBot = this.spheres.find(s => s.id === botId);
                if (deadBot) {
                    // 重新在碗中心頂部隨機均勻點投放下落
                    const pt = GlobalSpawner.generateRandomSurfacePoint();
                    deadBot.position.copy(pt);
                    deadBot.velocity.set(0, 0, 0);
                    deadBot.value = 8; // 復活後的保底基礎面額
                    deadBot.isEliminated = false;
                    deadBot.isActive = true;
                    deadBot.invulnerabilityTimer = 2.0; // 給予剛出生 2 秒防出生點被守屍的無敵盾
                    deadBot.recalculateAttributes();
                }
                // 移出死亡名單
                this.eliminatedRegistry.delete(botId);
            }
        });
    }

    /**
     * 向外接口公開獲取當前需要渲染在 UI 的純英文導引文字
     * @returns {string} English tutorial instructions
     */
    getUIInstructionText() {
        return AIDirector.activePopupText;
    }
}

// 導出全局實例化物理引擎控制器，供遊戲主要核心驅動鏈條 (GameLoop) 訂閱調用
const GlobalPhysicsEngine = new PhysicsEngineController();
// ============================================================================
// 8. 高級輔助碰撞預測與向量幾何工具矩陣 (Advanced Predictive Analytics & Matrix Math)
// ============================================================================

/**
 * 二維與三維空間幾何相交與射線投射 (Raycasting) 輔助類別
 * 用於高智商 AI 預判軌跡、繞開邊緣以及精確追蹤
 */
class GeometryToolbox {
    /**
     * 計算射線與水平圓形平面的交點
     * @param {Vector3} rayOrigin 射線起點
     * @param {Vector3} rayDirection 射線方向向量
     * @param {number} planeY 平面的 Y 軸高度
     * @param {Vector3} targetIntersection 用於存儲交點結果的向量
     * @returns {boolean} 是否成功相交
     */
    static rayIntersectHorizontalPlane(rayOrigin, rayDirection, planeY, targetIntersection) {
        if (Math.abs(rayDirection.y) < 0.00001) {
            return false; // 射線與平面平行
        }
        
        // 參數 t 計算公式: t = (planeY - rayOrigin.y) / rayDirection.y
        const t = (planeY - rayOrigin.y) / rayDirection.y;
        if (t < 0) {
            return false; // 交點在射線反方向
        }

        targetIntersection.x = rayOrigin.x + rayDirection.x * t;
        targetIntersection.y = planeY;
        targetIntersection.z = rayOrigin.z + rayDirection.z * t;
        return true;
    }

    /**
     * 計算點到有限線段的最短距離及其最近點
     * @param {Vector3} point 目標點
     * @param {Vector3} lineStart 線段起點
     * @param {Vector3} lineEnd 線段終點
     * @param {Vector3} targetClosestPoint 用於存儲最近點結果的向量
     * @returns {number} 最短距離的平方
     */
    static pointToLineSegmentDistanceSq(point, lineStart, lineEnd, targetClosestPoint) {
        const abX = lineEnd.x - lineStart.x;
        const abY = lineEnd.y - lineStart.y;
        const abZ = lineEnd.z - lineStart.z;

        const apX = point.x - lineStart.x;
        const apY = point.y - lineStart.y;
        const apZ = point.z - lineStart.z;

        const abLenSq = abX * abX + abY * abY + abZ * abZ;
        if (abLenSq === 0) {
            targetClosestPoint.copy(lineStart);
            return point.distanceToSq(lineStart);
        }

        // 投影比例 t
        let t = (apX * abX + apY * abY + apZ * abZ) / abLenSq;
        // 限制在區間 [0, 1] 內
        t = Math.max(0, Math.min(1, t));

        targetClosestPoint.set(
            lineStart.x + abX * t,
            lineStart.y + abY * t,
            lineStart.z + abZ * t
        );

        return point.distanceToSq(targetClosestPoint);
    }
}

// ============================================================================
// 9. 完整數據包快照與狀態同步系統 (State Snapshot & Rollback Serialization)
// ============================================================================

/**
 * 負責將當前幀所有物理與 AI 狀態打包序列化，以便提供給前端渲染網絡外插或單機回溯
 */
class PhysicsStateSnapshotManager {
    /**
     * 擷取當前物理世界的完整輕量化二進位/JSON 數據快照
     * @param {PhysicsEngineController} engine 物理引擎實例
     * @returns {Object} 序列化狀態快照物件
     */
    static createSnapshot(engine) {
        const snapshot = {
            timestamp: Date.now(),
            spheres: [],
            coins: [],
            crystals: []
        };

        // 備份球體狀態
        for (let i = 0; i < engine.spheres.length; i++) {
            const s = engine.spheres[i];
            snapshot.spheres.push({
                id: s.id,
                x: s.position.x,
                y: s.position.y,
                z: s.position.z,
                vx: s.velocity.x,
                vy: s.velocity.y,
                vz: s.velocity.z,
                value: s.value,
                coins: s.wallet.coins,
                eliminated: s.isEliminated,
                invTimer: s.invulnerabilityTimer
            });
        }

        // 備份金幣狀態
        for (let i = 0; i < engine.coins.length; i++) {
            const c = engine.coins[i];
            if (c.isActive) {
                snapshot.coins.push({ id: c.id, x: c.position.x, z: c.position.z });
            }
        }

        // 備份金屬水晶狀態
        for (let i = 0; i < engine.crystals.length; i++) {
            const cr = engine.crystals[i];
            if (cr.isActive) {
                snapshot.crystals.push({ id: cr.id, x: cr.position.x, y: cr.position.y, z: cr.position.z, val: cr.value });
            }
        }

        return snapshot;
    }

    /**
     * 從指定的歷史快照中強制恢復物理世界狀態 (多用於網絡同步或校正)
     * @param {PhysicsEngineController} engine 物理引擎實例
     * @param {Object} snapshot 歷史快照數據
     */
    static loadSnapshot(engine, snapshot) {
        if (!snapshot) return;

        // 恢復球體數據
        snapshot.spheres.forEach(sData => {
            const sphere = engine.spheres.find(s => s.id === sData.id);
            if (sphere) {
                sphere.position.set(sData.x, sData.y, sData.z);
                sphere.velocity.set(sData.vx, sData.vy, sData.vz);
                sphere.value = sData.value;
                sphere.wallet.coins = sData.coins;
                sphere.isEliminated = sData.eliminated;
                sphere.isActive = !sData.eliminated;
                sphere.invulnerabilityTimer = sData.invTimer;
                sphere.recalculateAttributes();
            }
        });

        // 重構金幣池
        engine.coins = [];
        snapshot.coins.forEach(cData => {
            const coin = new GoldCoin(cData.id, cData.x, cData.z);
            engine.coins.push(coin);
        });

        // 重構水晶池
        engine.crystals = [];
        snapshot.crystals.forEach(crData => {
            const crystal = new GoldCrystal(crData.id, crData.x, crData.y, crData.z, crData.val);
            engine.crystals.push(crystal);
        });
    }
}

// ============================================================================
// 10. 生產環境壓力測試與診斷工具 (Diagnostics & Benchmarking)
// ============================================================================

/**
 * 用於檢測物理引擎在高負載（如 20 人極度碰撞、上百金幣）下的幀率、耗時與記憶體外洩指標
 */
class PhysicsDiagnostics {
    constructor() {
        this.frameTimes = [];
        this.maxLoggedFrames = 300;
        this.lastReportTime = Date.now();
    }

    /**
     * 紀錄單次物理步進耗時
     * @param {number} durationMs 毫秒數
     */
    recordFrame(durationMs) {
        this.frameTimes.push(durationMs);
        if (this.frameTimes.length > this.maxLoggedFrames) {
            this.frameTimes.shift();
        }

        const now = Date.now();
        // 每 5 秒在後台輸出一次基礎效能診斷數據
        if (now - this.lastReportTime > 5000) {
            this.printReport();
            this.lastReportTime = now;
        }
    }

    /**
     * 計算平均耗時並輸出
     */
    printReport() {
        if (this.frameTimes.length === 0) return;
        const total = this.frameTimes.reduce((a, b) => a + b, 0);
        const avg = total / this.frameTimes.length;
        const max = Math.max(...this.frameTimes);
        
        console.log(`[Physics Engine Performance Report] Avg Step Time: ${avg.toFixed(3)}ms | Max Spike: ${max.toFixed(3)}ms (Window: ${this.frameTimes.length} frames)`);
    }
}

const GlobalDiagnostics = new PhysicsDiagnostics();

// ============================================================================
// 11. 自定義高等力學附加模組 (Custom Force Fields & Specialized Modifiers)
// ============================================================================

/**
 * 戰場進階環境干擾力欄位 (提供未來地圖動態事件擴充，如碗中央黑洞或龍捲風)
 */
class EnvironmentForceField {
    constructor(type = "none") {
        this.type = type; // "none", "vortex", "repulsion"
        this.center = new Vector3(0, -PhysicsConfig.BOWL_DEPTH, 0);
        this.intensity = 5.0;
        this.effectiveRadius = 45.0;
    }

    /**
     * 計算並施加額外的特殊物理欄位加速度
     * @param {RollingSphere} ball 
     * @param {number} dt 
     */
    applyFieldForce(ball, dt) {
        if (this.type === "none" || ball.isEliminated) return;

        const dist = ball.position.distanceTo(this.center);
        if (dist > this.effectiveRadius || dist === 0) return;

        const forceVec = new Vector3();
        
        if (this.type === "vortex") {
            // 旋渦力：向心力與切向力的混合
            const toCenter = Vector3.subVectors(this.center, ball.position).normalize();
            const tangent = new Vector3(-toCenter.z, 0, toCenter.x); // 切線向量
            
            // 越靠近中心，吸引與旋轉力越強
            const factor = (1.0 - dist / this.effectiveRadius) * this.intensity;
            forceVec.copy(toCenter).multiplyScalar(0.4).add(tangent.multiplyScalar(0.6)).multiplyScalar(factor);
        } else if (this.type === "repulsion") {
            // 排斥力
            const fromCenter = Vector3.subVectors(ball.position, this.center).normalize();
            const factor = (1.0 - dist / this.effectiveRadius) * this.intensity;
            forceVec.copy(fromCenter).multiplyScalar(factor);
        }

        // 將欄位加速度疊加給球體速度
        ball.velocity.add(forceVec.multiplyScalar(dt));
    }
}

const GlobalForceField = new EnvironmentForceField("none");
// ============================================================================
// 12. 頂級 AI 預判防禦與極限追獵路徑修正模組 (Advanced AI Path Correction)
// ============================================================================

/**
 * 針對 AI 決策的方向進行精細的物理障礙物與碗邊緣二級校正
 * 包含預判與前方多個大球、牆體或虛空的碰撞趨勢，提前修正切向力
 */
class SteeringPathSanitizer {
    /**
     * 對 AI 原始欲前進的方向向量進行安全性過濾與障礙物繞行修正
     * @param {RollingSphere} aiBall 目前正在進行過濾的 AI 實體
     * @param {Vector3} rawDirection 原始欲前進的方向
     * @param {Array<RollingSphere>} allBalls 戰場全體球體列表
     * @returns {Vector3} 經過安全性修正後的防自殺、防卡牆單位前進方向向量
     */
    static sanitize(aiBall, rawDirection, allBalls) {
        if (rawDirection.lengthSq() < 0.001) return rawDirection;
        
        const correctedDir = rawDirection.clone().normalize();
        const lookAheadDistance = 5.0 + (aiBall.velocity.length() * 0.4); // 預判前瞻距離隨速度動態延伸
        
        // 預測位置
        const futurePos = aiBall.position.clone().add(correctedDir.clone().multiplyScalar(lookAheadDistance));
        const futureDistSq = futurePos.x * futurePos.x + futurePos.z * futurePos.z;

        // A. 預判邊緣防墜崖修正 (Edge Avoidance)
        if (futureDistSq > PhysicsConfig.BOWL_RADIUS * PhysicsConfig.BOWL_RADIUS * 0.78) {
            // 越靠近邊緣，向心修正的急迫性越高
            const centerVec = new Vector3(-aiBall.position.x, 0, -aiBall.position.z).normalize();
            
            // 計算切線方向，決定是往左轉還是往右轉避開
            const tangentVec = new Vector3(-correctedDir.z, 0, correctedDir.x);
            if (rawDirection.dot(tangentVec) < 0) {
                tangentVec.multiplyScalar(-1);
            }

            // 混合向心拉力與切線擦邊滑行力
            correctedDir.copy(centerVec).multiplyScalar(0.6).add(tangentVec.multiplyScalar(0.4)).normalize();
        }

        // B. 多目標碰撞路徑預判與側向躲避 (Multi-Object Collision Avoidance)
        let primaryObstacle = null;
        let minObstacleDistSq = Infinity;
        const closestPointOnSegment = new Vector3();

        for (let i = 0; i < allBalls.length; i++) {
            const obstacle = allBalls[i];
            if (obstacle.id === aiBall.id || obstacle.isEliminated) continue;

            // 只防範比自己大、具有威脅性，或者是相同體積不想無謂相撞的對象
            if (obstacle.value < aiBall.value) continue;

            // 計算 AI 前瞻射線段上的最近點
            const lineEnd = aiBall.position.clone().add(correctedDir.clone().multiplyScalar(lookAheadDistance));
            const distSq = GeometryToolbox.pointToLineSegmentDistanceSq(obstacle.position, aiBall.position, lineEnd, closestPointOnSegment);

            // 觸發潛在碰撞包圍半徑
            const avoidRadius = aiBall.radius + obstacle.radius + 1.5;
            if (distSq < avoidRadius * avoidRadius) {
                if (distSq < minObstacleDistSq) {
                    minObstacleDistSq = distSq;
                    primaryObstacle = obstacle;
                }
            }
        }

        // 如果前方有高威脅大球阻擋，產生一個垂直於前進方向的排斥躲避力
        if (primaryObstacle) {
            const avoidanceLateralVec = Vector3.subVectors(closestPointOnSegment, primaryObstacle.position).normalize();
            avoidanceLateralVec.y = 0;

            // 根據距離越近，偏轉迴避權重越大的法則
            const weight = 1.0 - (Math.sqrt(minObstacleDistSq) / lookAheadDistance);
            correctedDir.add(avoidanceLateralVec.multiplyScalar(weight * 1.8)).normalize();
        }

        return correctedDir;
    }
}

// ============================================================================
// 13. 整合式物理時間步進微調調節器 (Sub-stepping Engine Integration)
// ============================================================================

/**
 * 用於極端高速球體穿插修正的高級時間微分子步進包裝器 (Sub-stepping Logic)
 * 確保在伺服器極高負載或本地球體因重力爆速時，不會發生穿透地形或穿透小球的 Bug
 */
class SubstepPhysicsIntegrator {
    /**
     * 將單個完整幀時間片切割為多個微小步進進行高頻率物理運算
     * @param {PhysicsEngineController} engine 物理引擎主要控制器
     * @param {number} deltaTime 原始單幀時間步進
     * @param {Vector3} playerInput 玩家操作方向
     * @param {number} substepsCount 切割子步進次數 (一般推薦 2-4 次)
     */
    static stepWithSubsteps(engine, deltaTime, playerInput, substepsCount = 3) {
        const subDt = deltaTime / substepsCount;
        const startTime = Date.now();

        for (let step = 0; step < substepsCount; step++) {
            // 1. 維護並刷新地圖普通金幣生態總量
            GlobalSpawner.maintainPopulation(engine.coins);

            // 2. 更新所有水晶、金幣位置
            for (let i = 0; i < engine.crystals.length; i++) {
                if (engine.crystals[i].isActive) engine.crystals[i].update(subDt);
            }
            for (let i = 0; i < engine.coins.length; i++) {
                if (engine.coins[i].isActive) engine.coins[i].update(subDt);
            }

            // 3. 計算 AI 決策方向、進行路徑過濾並套用物理
            for (let i = 0; i < engine.spheres.length; i++) {
                const ball = engine.spheres[i];
                if (ball.isEliminated) continue;

                if (!ball.isAI) {
                    ball.applySteering(playerInput);
                } else {
                    let aiSteer = AIDirector.computeTacticalDecision(ball, engine.spheres, engine.crystals, engine.coins);
                    // 套用高級預判過濾安全性修正
                    aiSteer = SteeringPathSanitizer.sanitize(ball, aiSteer, engine.spheres);
                    ball.applySteering(aiSteer);
                }

                // 注入環境特殊力場作用
                GlobalForceField.applyFieldForce(ball, subDt);

                // 更新核心物理數值
                ball.updatePhysics(subDt);
            }

            // 4. 碰撞檢測與動量交換管線
            for (let i = 0; i < engine.spheres.length; i++) {
                const ballA = engine.spheres[i];
                if (ballA.isEliminated) continue;

                for (let j = i + 1; j < engine.spheres.length; j++) {
                    const ballB = engine.spheres[j];
                    resolveSphereCollision(ballA, ballB, engine.crystals, (attacker, victim) => {
                        attacker.wallet.coins += PhysicsConfig.COIN_REWARD_ELIMINATION;
                        if (!victim.isAI) {
                            AIDirector.triggerTutorialPopup("GAME OVER! You were stripped into cosmic dust. Restarting match...");
                        } else if (!attacker.isAI) {
                            AIDirector.triggerTutorialPopup("GREAT STRIP KILLS! +10 Gold Bonus credited directly to your wallet.");
                        }
                    });
                }

                resolveItemCollection(ballA, engine.coins, engine.crystals);
            }

            // 5. 即時清除死掉的物件
            engine.crystals = engine.crystals.filter(c => c.isActive);
            engine.coins = engine.coins.filter(c => c.isActive);
        }

        // 6. 異步處理復活隊列 (不參與子步進，每幀處理一次即可)
        engine.processBotRespawns();

        // 7. 遞減導引文字計時器
        if (AIDirector.popupTimer > 0) {
            AIDirector.popupTimer -= deltaTime;
            if (AIDirector.popupTimer <= 0) {
                AIDirector.activePopupText = "";
            }
        }

        // 8. 紀錄性能開銷
        const duration = Date.now() - startTime;
        GlobalDiagnostics.recordFrame(duration);
    }
}

// ============================================================================
// 14. 完整外部驅動橋接接口封裝 (Bridge Module API Export)
// ============================================================================

/**
 * 暴露給主要遊戲框架 (如 Pixi.js, Three.js 或 PlayCanvas 渲染層) 的標準調用介面
 */
const BallRangerPhysicsBridge = {
    // 獲取配置常數快照
    Config: PhysicsConfig,
    
    // 獲取碗狀地形實例
    BowlGeometry: ArenaBowl,
    
    // 初始化物理世界入口
    init: function(matchNumber) {
        GlobalPhysicsEngine.initializeMatch(matchNumber);
    },
    
    // 核心心跳步進入口 (外層循環每幀調用)
    update: function(dt, playerXInput, playerZInput) {
        const inputVec = new Vector3(playerXInput, 0, playerZInput);
        // 使用子步進物理積分器提供高精度模擬，穩定鎖定 3 步進
        SubstepPhysicsIntegrator.stepWithSubsteps(GlobalPhysicsEngine, dt, inputVec, 3);
    },
    
    // 獲取全體繪圖對象數據
    getRenderEntities: function() {
        return {
            spheres: GlobalPhysicsEngine.spheres,
            coins: GlobalPhysicsEngine.coins,
            crystals: GlobalPhysicsEngine.crystals,
            player: GlobalPhysicsEngine.playerRef,
            uiGuideline: GlobalPhysicsEngine.getUIInstructionText()
        };
    },

    // 網絡/存檔快照機制橋接
    saveState: function() {
        return PhysicsStateSnapshotManager.createSnapshot(GlobalPhysicsEngine);
    },

    loadState: function(stateSnapshot) {
        PhysicsStateSnapshotManager.loadSnapshot(GlobalPhysicsEngine, stateSnapshot);
    },

    // 動態變更戰場環境干擾力場種類
    setEnvironmentEvent: function(eventType) {
        GlobalForceField.type = eventType; // "none", "vortex", "repulsion"
    }
};

// 將橋接模組掛載至全域變數或導出，確保在全平台及瀏覽器架構中皆能無縫集成
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BallRangerPhysicsBridge;
} else {
    window.BallRangerPhysicsBridge = BallRangerPhysicsBridge;
}

/**
 * ============================================================================
 * PhysicsEngine.js 核心代碼段落至此完美輸出完畢。
 * 全代碼封裝了高維向量、參數化碗狀引力、50%數值精確剝離、4向黃金水晶爆裂生成、
 * 20人混戰高智商決策樹（含逃跑防墜邊緣側切、巨球邊緣處刑攔截前置量計算）、
 * 以及子步進防穿透物理管道。
 * ============================================================================
 */
