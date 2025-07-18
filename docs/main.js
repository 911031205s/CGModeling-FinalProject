/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");



class ThreeJSContainer {
    scene;
    light;
    world;
    cubeMeshes = [];
    cubeBodies = [];
    // ゲームの状態管理
    gameStarted = false; // ゲームが開始されたか
    gameOver = false; // ゲームが終了したか
    // スコア関係
    maxStackHeight = 0; // 最高積み上げ高さ
    failureCount = 0; // オブジェクトが落ちた回数
    maxFailures = 5; // ゲームオーバーになる失敗回数
    // 次に落ちてくるオブジェクト
    targetSpawnX = 0; // 次に生成されるオブジェクトの目標X座標
    targetSpawnZ = 0; // 次に生成されるオブジェクトの目標Z座標
    moveSpeed = 0.2; // プレイヤー操作による移動速度
    maxMoveRange = 10; // オブジェクトの水平移動の最大範囲
    spawnYPosition = 12; // オブジェクトが生成されるY座標
    // 現在操作中のオブジェクトのプレビュー
    currentPreviewMesh; // 現在プレビュー中のThree.jsメッシュ
    currentPreviewBody; // 現在プレビュー中のCannon.jsボディ
    // 落下
    canDropObject = true; // 落下させられるかどうか
    dropCooldown = 1.; // クールダウン時間
    // UI要素
    infoDiv; // ゲーム情報表示用のHTML要素
    startButton; // ゲームスタートボタン用のHTML要素
    restartButton; // リトライボタン用のHTML要素
    instructionsDiv; // 操作説明用のHTML要素
    gameOverDisplayDiv; // ゲームオーバー用のHTML要素
    // 落下ガイド
    dropGuideMesh; // 落下ガイドメッシュ
    // パーティクル関連
    cloud; // パーティクル群のメインオブジェクト
    particleVelocity = []; // 各パーティクルの速度を保持する配列
    particleAreaSize = 40; // パーティクルが分布する空間のサイズ
    // ループ制御ID
    physicsAndParticleFrameId; // 物理演算とパーティクルのループのID
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x1a1a2e)); // 暗い青紫のような色
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        // カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        //camera.lookAt(new THREE.Vector3(0, 10, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        orbitControls.target.set(0, 6, 0);
        this.createScene();
        // UI要素の生成と初期設定
        // ゲーム情報
        this.infoDiv = document.createElement('div');
        this.infoDiv.style.position = 'absolute';
        this.infoDiv.style.top = '20px';
        this.infoDiv.style.left = '20px';
        this.infoDiv.style.color = 'white';
        this.infoDiv.style.fontSize = '16px';
        this.infoDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.infoDiv.style.padding = '8px';
        this.infoDiv.style.borderRadius = '5px';
        document.body.appendChild(this.infoDiv);
        this.updateGameInfo();
        // ゲームスタート
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'ゲームスタート';
        this.startButton.style.position = 'absolute';
        this.startButton.style.top = '130px';
        this.startButton.style.left = '340px';
        this.startButton.style.transform = 'translateX(-50%)';
        this.startButton.style.padding = '15px 30px';
        this.startButton.style.fontSize = '26px';
        this.startButton.style.backgroundColor = '#4CAF50';
        this.startButton.style.color = 'white';
        this.startButton.style.border = 'none';
        this.startButton.style.borderRadius = '7px';
        this.startButton.style.cursor = 'pointer';
        document.body.appendChild(this.startButton);
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        // 操作説明
        this.instructionsDiv = document.createElement('div');
        this.instructionsDiv.style.position = 'absolute';
        this.instructionsDiv.style.top = '230px';
        this.instructionsDiv.style.left = '193px';
        this.instructionsDiv.style.color = 'white';
        this.instructionsDiv.style.fontSize = '15px';
        this.instructionsDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this.instructionsDiv.style.padding = '10px';
        this.instructionsDiv.style.borderRadius = '5px';
        this.instructionsDiv.style.textAlign = 'center';
        this.instructionsDiv.innerHTML = `
            <h3>操作方法</h3>
            <p>◀ ▶ ▲ ▼ : ブロックを水平移動</p>
            <p>スペースキー : ブロックをX軸周りに回転</p>
            <p>Enterキー : ブロックを落下</p>
        `;
        document.body.appendChild(this.instructionsDiv);
        // リトライボタン
        this.restartButton = document.createElement('button');
        this.restartButton.textContent = 'リトライ';
        this.restartButton.style.position = 'absolute';
        this.restartButton.style.top = '300px';
        this.restartButton.style.left = '340px';
        this.restartButton.style.transform = 'translateX(-50%)';
        this.restartButton.style.padding = '10px 20px';
        this.restartButton.style.fontSize = '26px';
        this.restartButton.style.backgroundColor = '#f44336';
        this.restartButton.style.color = 'white';
        this.restartButton.style.border = 'none';
        this.restartButton.style.borderRadius = '8px';
        this.restartButton.style.cursor = 'pointer';
        this.restartButton.style.display = 'none';
        document.body.appendChild(this.restartButton);
        // ゲームオーバー表示
        this.gameOverDisplayDiv = document.createElement('div');
        this.gameOverDisplayDiv.style.position = 'absolute';
        this.gameOverDisplayDiv.style.top = '130px';
        this.gameOverDisplayDiv.style.left = '340px';
        this.gameOverDisplayDiv.style.transform = 'translateX(-50%)';
        this.gameOverDisplayDiv.style.color = 'white';
        this.gameOverDisplayDiv.style.fontSize = '30px';
        this.gameOverDisplayDiv.style.fontWeight = 'bold';
        this.gameOverDisplayDiv.style.textAlign = 'center';
        this.gameOverDisplayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 半透明の黒背景
        this.gameOverDisplayDiv.style.padding = '20px 30px';
        this.gameOverDisplayDiv.style.borderRadius = '10px';
        this.gameOverDisplayDiv.style.border = '2px solid white';
        this.gameOverDisplayDiv.style.display = 'none';
        document.body.appendChild(this.gameOverDisplayDiv);
        this.restartButton.addEventListener('click', () => {
            this.resetGame();
            if (this.restartButton) {
                this.restartButton.style.display = 'none';
            }
            if (this.startButton) {
                this.startButton.style.display = 'block';
            }
            if (this.instructionsDiv) {
                this.instructionsDiv.style.display = 'block';
            }
            if (this.infoDiv) {
                this.infoDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
            }
            if (this.gameOverDisplayDiv) {
                this.gameOverDisplayDiv.style.display = 'none';
            }
            this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x1a1a2e);
        });
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            // プレイヤーの操作に合わせてプレビューの位置と回転を更新
            if (this.currentPreviewMesh && this.currentPreviewBody) {
                this.currentPreviewMesh.position.x = this.targetSpawnX;
                this.currentPreviewMesh.position.z = this.targetSpawnZ;
                this.currentPreviewMesh.position.y = this.spawnYPosition;
                this.currentPreviewBody.position.set(this.currentPreviewMesh.position.x, this.currentPreviewMesh.position.y, this.currentPreviewMesh.position.z);
                this.currentPreviewBody.quaternion.set(this.currentPreviewMesh.quaternion.x, this.currentPreviewMesh.quaternion.y, this.currentPreviewMesh.quaternion.z, this.currentPreviewMesh.quaternion.w);
                // 落下ガイドメッシュの表示状態と位置・回転の更新
                if (this.dropGuideMesh) {
                    this.dropGuideMesh.position.x = this.currentPreviewMesh.position.x;
                    this.dropGuideMesh.position.z = this.currentPreviewMesh.position.z;
                    this.dropGuideMesh.position.y = 0.001;
                    this.dropGuideMesh.quaternion.set(this.currentPreviewMesh.quaternion.x, this.currentPreviewMesh.quaternion.y, this.currentPreviewMesh.quaternion.z, this.currentPreviewMesh.quaternion.w);
                    this.dropGuideMesh.visible = true;
                }
            }
            else if (this.dropGuideMesh) {
                this.dropGuideMesh.visible = false;
            }
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        // キーボードイベント
        document.addEventListener('keydown', (event) => {
            // ゲームスタート
            if (!this.gameStarted && event.key === 'Enter') {
                event.preventDefault();
                this.startGame();
                return;
            }
            // ゲームオーバー時にEnterでリトライ
            if (this.gameOver && event.key === 'Enter') {
                event.preventDefault();
                this.resetGame();
                if (this.restartButton) {
                    this.restartButton.style.display = 'none'; // リトライボタンを非表示に
                }
                if (this.startButton) {
                    this.startButton.style.display = 'block'; // スタートボタンを表示に
                }
                if (this.instructionsDiv) {
                    this.instructionsDiv.style.display = 'block'; // 操作説明を表示に
                }
                if (this.infoDiv) {
                    this.infoDiv.style.backgroundColor = 'rgba(0,0,0,0.5)'; // 情報パネルの色を元に戻す
                }
                if (this.gameOverDisplayDiv) { // ゲームオーバー表示を非表示にする
                    this.gameOverDisplayDiv.style.display = 'none';
                }
                this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x1a1a2e); // 背景色を元に戻す
                return;
            }
            // ゲームが開始されて、ゲームオーバーではないとき
            if (this.gameStarted && !this.gameOver) {
                switch (event.key) {
                    // 矢印で移動
                    case 'ArrowLeft':
                        event.preventDefault();
                        this.targetSpawnX = Math.max(-this.maxMoveRange, this.targetSpawnX - this.moveSpeed);
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        this.targetSpawnX = Math.min(this.maxMoveRange, this.targetSpawnX + this.moveSpeed);
                        break;
                    case 'ArrowUp':
                        event.preventDefault();
                        this.targetSpawnZ = Math.max(-this.maxMoveRange, this.targetSpawnZ - this.moveSpeed);
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        this.targetSpawnZ = Math.min(this.maxMoveRange, this.targetSpawnZ + this.moveSpeed);
                        break;
                    // スペースキーで回転
                    case ' ':
                        event.preventDefault();
                        if (this.currentPreviewMesh && this.currentPreviewBody) {
                            this.currentPreviewMesh.rotation.x += Math.PI / 2; // X軸周りに90度回転
                            this.currentPreviewBody.quaternion.set(this.currentPreviewMesh.quaternion.x, this.currentPreviewMesh.quaternion.y, this.currentPreviewMesh.quaternion.z, this.currentPreviewMesh.quaternion.w);
                        }
                        break;
                    // Enterキーで落下
                    case 'Enter':
                        event.preventDefault();
                        if (this.canDropObject && this.currentPreviewMesh && this.currentPreviewBody) {
                            this.canDropObject = false;
                            // プレビューから物理へ
                            this.world.addBody(this.currentPreviewBody);
                            this.cubeMeshes.push(this.currentPreviewMesh);
                            this.cubeBodies.push(this.currentPreviewBody);
                            // プレビューをクリア
                            this.currentPreviewMesh = null;
                            this.currentPreviewBody = null;
                            // ガイドを非表示    
                            if (this.dropGuideMesh) {
                                this.dropGuideMesh.visible = false;
                            }
                            // クールダウン
                            setTimeout(() => {
                                this.canDropObject = true;
                                if (!this.gameOver) {
                                    this.spawnNextObjectForPreview();
                                }
                            }, this.dropCooldown * 1000);
                        }
                        break;
                }
            }
        });
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        // 物理演算ワールド
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.friction = 0.9;
        this.world.defaultContactMaterial.restitution = 0.01;
        console.log(this.world.defaultContactMaterial.restitution);
        // 地面
        const groundSize = 4;
        const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(groundSize, 0.5, groundSize);
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xc7c4bd, roughness: 0.8, metalness: 0.1 });
        const groundMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(groundGeometry, groundMaterial);
        groundMesh.position.y = -0.25;
        this.scene.add(groundMesh);
        const groundShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(groundSize / 2, 0.5, groundSize / 2));
        const groundBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0, position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -0.25, 0) });
        groundBody.addShape(groundShape);
        groundBody.position.set(groundMesh.position.x, groundMesh.position.y, groundMesh.position.z);
        groundBody.quaternion.set(groundMesh.quaternion.x, groundMesh.quaternion.y, groundMesh.quaternion.z, groundMesh.quaternion.w);
        this.world.addBody(groundBody);
        // ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        this.light.position.set(10, 20, 10);
        this.scene.add(this.light);
        // 落下ガイドメッシュの初期化
        const guideMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.2, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        this.dropGuideMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry(), guideMaterial);
        this.dropGuideMesh.position.y = 0.01; // 地面よりわずかに浮かせる
        this.dropGuideMesh.visible = false;
        this.scene.add(this.dropGuideMesh);
        // パーティクルの生成
        let createParticlesLocal = () => {
            // ジオメトリの作成
            let geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
            let generateSprite = () => {
                //新しいキャンバスの作成
                let canvas = document.createElement('canvas');
                canvas.width = 16;
                canvas.height = 16;
                // 円形のグラデーションの作成
                let context = canvas.getContext('2d');
                if (!context)
                    return new three__WEBPACK_IMPORTED_MODULE_1__.Texture();
                const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(0,191,255,1)');
                gradient.addColorStop(0.4, 'rgba(0,0,128,1)');
                gradient.addColorStop(1, 'rgba(0,0,0,1)');
                context.fillStyle = gradient;
                context.fillRect(0, 0, canvas.width, canvas.height);
                // テクスチャの生成
                const texture = new three__WEBPACK_IMPORTED_MODULE_1__.Texture(canvas);
                texture.needsUpdate = true;
                return texture;
            };
            // マテリアルの作成
            let material = new three__WEBPACK_IMPORTED_MODULE_1__.PointsMaterial({
                size: 1.0,
                map: generateSprite(),
                transparent: true,
                blending: three__WEBPACK_IMPORTED_MODULE_1__.AdditiveBlending,
                color: 0xFFFFFF,
                depthWrite: false,
                opacity: 0.8
            });
            // particleの作成
            const particleNum = 1000;
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            this.particleVelocity = [];
            // 各パーティクルの初期位置と速度を設定
            for (let i = 0; i < particleNum; i++) {
                const x = (Math.random() - 0.5) * this.particleAreaSize;
                const y = (Math.random() - 0.5) * this.particleAreaSize;
                const z = (Math.random() - 0.5) * this.particleAreaSize;
                positions[particleIndex++] = x;
                positions[particleIndex++] = y;
                positions[particleIndex++] = z;
                const vx = (Math.random() - 0.5) * 0.1;
                const vy = -(0.5 + Math.random() * 0.5);
                const vz = (Math.random() - 0.5) * 0.1;
                this.particleVelocity.push(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(vx, vy, vz));
            }
            geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(positions, 3));
            // THREE.Pointsの作成
            this.cloud = new three__WEBPACK_IMPORTED_MODULE_1__.Points(geometry, material);
            this.scene.add(this.cloud);
        };
        createParticlesLocal(); // パーティクル生成関数を呼び出す
        // 物理演算とパーティクルを更新
        const physicsAndParticleClock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();
        const updatePhysicsAndParticles = (time) => {
            // ゲーム開始されて、ゲームオーバーではない場合のみ更新
            if (this.gameStarted && !this.gameOver) {
                const deltaTime = physicsAndParticleClock.getDelta(); // 前回の物理更新からの経過時間
                // 物理演算の更新
                this.world.step(1 / 60, deltaTime, 10);
                for (let i = 0; i < this.cubeMeshes.length; ++i) {
                    this.cubeMeshes[i].position.set(this.cubeBodies[i].position.x, this.cubeBodies[i].position.y, this.cubeBodies[i].position.z);
                    this.cubeMeshes[i].quaternion.set(this.cubeBodies[i].quaternion.x, this.cubeBodies[i].quaternion.y, this.cubeBodies[i].quaternion.z, this.cubeBodies[i].quaternion.w);
                    // オブジェクトが地面の下に落ちた場合
                    if (this.cubeBodies[i].position.y < -5 && this.cubeBodies[i].mass > 0) {
                        this.failureCount++;
                        this.world.removeBody(this.cubeBodies[i]);
                        this.scene.remove(this.cubeMeshes[i]);
                        this.cubeBodies.splice(i, 1);
                        this.cubeMeshes.splice(i, 1);
                        i--;
                        this.updateGameInfo();
                        // 5個落ちたら
                        if (this.failureCount >= this.maxFailures) {
                            this.gameOver = true;
                            this.stopGameLogic();
                        }
                    }
                }
                // パーティクルの位置更新
                const geom = this.cloud.geometry;
                const positions = geom.getAttribute('position');
                for (let i = 0; i < positions.count; i++) {
                    let x = positions.getX(i);
                    let y = positions.getY(i);
                    let z = positions.getZ(i);
                    const velocity = this.particleVelocity[i];
                    x += velocity.x * deltaTime;
                    y += velocity.y * deltaTime;
                    z += velocity.z * deltaTime;
                    // パーティクルが画面下端を超えたら上に戻す
                    if (y < -this.particleAreaSize / 2) {
                        y = this.particleAreaSize / 2;
                        x = (Math.random() - 0.5) * this.particleAreaSize;
                        z = (Math.random() - 0.5) * this.particleAreaSize;
                    }
                    positions.setX(i, x);
                    positions.setY(i, y);
                    positions.setZ(i, z);
                }
                positions.needsUpdate = true;
                this.updateGameInfo();
            }
            requestAnimationFrame(updatePhysicsAndParticles);
        };
        requestAnimationFrame(updatePhysicsAndParticles);
    };
    // ゲーム開始時に呼び出すメソッド
    startGame = () => {
        this.gameStarted = true; // ゲーム開始
        this.gameOver = false;
        this.failureCount = 0; // 失敗回数をリセット
        this.maxStackHeight = 0; // 最高高さをリセット
        this.updateGameInfo(); // UI情報を更新
        this.spawnNextObjectForPreview(); // 最初のブロックをプレビュー表示
        // UI要素の表示/非表示の切り替え
        if (this.startButton) {
            this.startButton.style.display = 'none'; // スタートボタンを非表示
        }
        if (this.instructionsDiv) {
            this.instructionsDiv.style.display = 'none'; // 操作説明を非表示
        }
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x1a1a2e); // 背景色を初期状態に戻す
    };
    // ゲーム状態をリセットし、初期状態に戻すメソッド
    resetGame = () => {
        // シーンと物理ワールドから既存のブロックをすべて削除
        this.cubeMeshes.forEach(mesh => this.scene.remove(mesh));
        this.cubeBodies.forEach(body => this.world.removeBody(body));
        this.cubeMeshes = []; // 配列をクリア
        this.cubeBodies = []; // 配列をクリア
        // ゲーム状態フラグをリセット
        this.gameStarted = false;
        this.gameOver = false;
        this.maxStackHeight = 0;
        this.failureCount = 0;
        this.targetSpawnX = 0;
        this.targetSpawnZ = 0;
        this.canDropObject = true;
        // プレビューオブジェクトと落下ガイドを削除/非表示
        if (this.currentPreviewMesh) {
            this.scene.remove(this.currentPreviewMesh);
            this.currentPreviewMesh = null;
            this.currentPreviewBody = null;
        }
        if (this.dropGuideMesh) {
            this.dropGuideMesh.visible = false;
        }
        this.updateGameInfo(); // UI情報を更新
        // リセット時に物理演算とパーティクル更新ループを停止
        if (this.physicsAndParticleFrameId !== null) {
            cancelAnimationFrame(this.physicsAndParticleFrameId);
            this.physicsAndParticleFrameId = null;
        }
    };
    // 次に落下させるオブジェクトの生成とプレビュー表示するメソッド
    spawnNextObjectForPreview = () => {
        // オブジェクトのランダムなサイズを決定
        const minSize = 0.5; // オブジェクトの最小サイズ
        const maxSize = 1.0; // オブジェクトの最大サイズ
        const randomSize = minSize + (Math.random() * (maxSize - minSize));
        // オブジェクトの形状タイプを定義
        const geometries = [
            // 標準的な立方体
            { geo: new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(randomSize, randomSize, randomSize), cannonShape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(randomSize / 2, randomSize / 2, randomSize / 2)) },
            // 幅広の平たい直方体 (板状)
            { geo: new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(randomSize * 2.0, randomSize * 0.5, randomSize * 1.5), cannonShape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(randomSize * 1.0, randomSize * 0.25, randomSize * 0.75)) },
            // 細長い直方体 (棒状)
            { geo: new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(randomSize * 0.5, randomSize * 2.5, randomSize * 0.5), cannonShape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(randomSize * 0.25, randomSize * 1.25, randomSize * 0.25)) },
            // 少し大きめの立方体
            { geo: new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(randomSize * 1.2, randomSize * 1.2, randomSize * 1.2), cannonShape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(randomSize * 0.6, randomSize * 0.6, randomSize * 0.6)) },
            // 正十二面体
            { geo: new three__WEBPACK_IMPORTED_MODULE_1__.DodecahedronGeometry(randomSize * 0.7, 0), cannonShape: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(randomSize * 0.7) }
        ];
        let selectedType;
        if (Math.random() < 0.1) { // 10%の確率で多面体を選択
            selectedType = geometries[4]; // 多面体
        }
        else {
            // 残りの90%は立方体・直方体の中からランダムに選択
            selectedType = geometries[Math.floor(Math.random() * (geometries.length - 1))];
        }
        const geometry = selectedType.geo;
        const cannonShape = selectedType.cannonShape;
        // オブジェクトの色をランダムに選択
        const colors = [
            0x00FFFF,
            0xFFFF00,
            0xFF00FF,
            0x00FF00,
            0xFF6600,
            0xFF33FF // ホットピンク
        ];
        const randomColor = new three__WEBPACK_IMPORTED_MODULE_1__.Color(colors[Math.floor(Math.random() * colors.length)]);
        // オブジェクトのマテリアル
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: randomColor, roughness: 0.5, metalness: 0.2 });
        const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
        mesh.position.set(this.targetSpawnX, this.spawnYPosition, this.targetSpawnZ);
        mesh.castShadow = true;
        this.scene.add(mesh);
        const body = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({
            mass: 1,
            shape: cannonShape,
            position: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(mesh.position.x, mesh.position.y, mesh.position.z),
            velocity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 0.1, 0)
        });
        this.currentPreviewMesh = mesh;
        this.currentPreviewBody = body;
        // 落下ガイドの更新
        if (this.dropGuideMesh) {
            this.dropGuideMesh.geometry = geometry.clone();
            this.dropGuideMesh.visible = true;
        }
    };
    // ゲーム情報を更新して、表示するメソッド
    updateGameInfo = () => {
        let currentMaxHeight = 0;
        // 現在のブロックの中で最も高いY座標を見つける
        this.cubeMeshes.forEach(mesh => {
            if (mesh.position.y > currentMaxHeight) {
                currentMaxHeight = mesh.position.y;
            }
        });
        // 最高積み上げ高さを計算
        this.maxStackHeight = Math.max(0, currentMaxHeight - 0.5);
        // 情報の更新
        if (this.infoDiv) {
            this.infoDiv.innerHTML = `
                Failures: ${this.failureCount} / ${this.maxFailures}<br>
                Height: ${this.maxStackHeight.toFixed(2)}m
            `;
        }
    };
    // ゲームを終了するメソッド
    stopGameLogic = () => {
        // 動きを止める
        this.cubeBodies.forEach(body => {
            body.mass = 0;
            body.velocity.set(0, 0, 0);
            body.angularVelocity.set(0, 0, 0);
            body.allowSleep = true;
        });
        // プレビュー
        if (this.currentPreviewMesh) {
            this.scene.remove(this.currentPreviewMesh);
            this.currentPreviewMesh = null;
            this.currentPreviewBody = null;
        }
        // 落下ガイドを非表示
        if (this.dropGuideMesh) {
            this.dropGuideMesh.visible = false;
        }
        // リトライボタンを表示する
        if (this.restartButton) {
            this.restartButton.style.display = 'block';
        }
        // 情報パネルの背景色のみ変更
        if (this.infoDiv) {
            this.infoDiv.style.backgroundColor = 'rgba(255,0,0,0.7)';
        }
        // シーンの背景色を赤くする
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x8B0000);
        // ゲームオーバーを表示
        if (this.gameOverDisplayDiv) {
            this.gameOverDisplayDiv.innerHTML = `
                GAME OVER!<br>
                最後の高さ: ${this.maxStackHeight.toFixed(2)}m
            `;
            this.gameOverDisplayDiv.style.display = 'block';
        }
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 15, 15));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3SCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXRLLG9CQUFvQjtvQkFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO3dCQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxVQUFVLENB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LEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tICdjYW5ub24tZXMnO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG4gICAgcHJpdmF0ZSBjdWJlTWVzaGVzOiBUSFJFRS5NZXNoW10gPSBbXTtcbiAgICBwcml2YXRlIGN1YmVCb2RpZXM6IENBTk5PTi5Cb2R5W10gPSBbXTtcblxuICAgIC8vIOOCsuODvOODoOOBrueKtuaFi+euoeeQhlxuICAgIHByaXZhdGUgZ2FtZVN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTsgICAvLyDjgrLjg7zjg6DjgYzplovlp4vjgZXjgozjgZ/jgYtcbiAgICBwcml2YXRlIGdhbWVPdmVyOiBib29sZWFuID0gZmFsc2U7ICAvLyDjgrLjg7zjg6DjgYzntYLkuobjgZfjgZ/jgYtcblxuICAgIC8vIOOCueOCs+OCoumWouS/glxuICAgIHByaXZhdGUgbWF4U3RhY2tIZWlnaHQ6IG51bWJlciA9IDA7IC8vIOacgOmrmOepjeOBv+S4iuOBkumrmOOBlVxuICAgIHByaXZhdGUgZmFpbHVyZUNvdW50OiBudW1iZXIgPSAwOyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgYzokL3jgaHjgZ/lm57mlbBcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1heEZhaWx1cmVzOiBudW1iZXIgPSA1OyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zjgavjgarjgovlpLHmlZflm57mlbBcblxuICAgIC8vIOasoeOBq+iQveOBoeOBpuOBj+OCi+OCquODluOCuOOCp+OCr+ODiFxuICAgIHByaXZhdGUgdGFyZ2V0U3Bhd25YOiBudW1iZXIgPSAwOyAvLyDmrKHjgavnlJ/miJDjgZXjgozjgovjgqrjg5bjgrjjgqfjgq/jg4jjga7nm67mqJlY5bqn5qiZXG4gICAgcHJpdmF0ZSB0YXJnZXRTcGF3blo6IG51bWJlciA9IDA7IC8vIOasoeOBq+eUn+aIkOOBleOCjOOCi+OCquODluOCuOOCp+OCr+ODiOOBruebruaomVrluqfmqJlcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1vdmVTcGVlZDogbnVtYmVyID0gMC4yOyAvLyDjg5fjg6zjgqTjg6Tjg7zmk43kvZzjgavjgojjgovnp7vli5XpgJ/luqZcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1heE1vdmVSYW5nZTogbnVtYmVyID0gMTA7IC8vIOOCquODluOCuOOCp+OCr+ODiOOBruawtOW5s+enu+WLleOBruacgOWkp+evhOWbslxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bhd25ZUG9zaXRpb246IG51bWJlciA9IDEyOyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgYznlJ/miJDjgZXjgozjgotZ5bqn5qiZXG5cbiAgICAvLyDnj77lnKjmk43kvZzkuK3jga7jgqrjg5bjgrjjgqfjgq/jg4jjga7jg5fjg6zjg5Pjg6Xjg7xcbiAgICBwcml2YXRlIGN1cnJlbnRQcmV2aWV3TWVzaDogVEhSRUUuTWVzaDsgLy8g54++5Zyo44OX44Os44OT44Ol44O85Lit44GuVGhyZWUuanPjg6Hjg4Pjgrfjg6VcbiAgICBwcml2YXRlIGN1cnJlbnRQcmV2aWV3Qm9keTogQ0FOTk9OLkJvZHk7IC8vIOePvuWcqOODl+ODrOODk+ODpeODvOS4reOBrkNhbm5vbi5qc+ODnOODh+OCo1xuXG4gICAgLy8g6JC95LiLXG4gICAgcHJpdmF0ZSBjYW5Ecm9wT2JqZWN0OiBib29sZWFuID0gdHJ1ZTsgIC8vIOiQveS4i+OBleOBm+OCieOCjOOCi+OBi+OBqeOBhuOBi1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZHJvcENvb2xkb3duOiBudW1iZXIgPSAxLjsgLy8g44Kv44O844Or44OA44Km44Oz5pmC6ZaTXG5cbiAgICAvLyBVSeimgee0oFxuICAgIHByaXZhdGUgaW5mb0RpdjogSFRNTERpdkVsZW1lbnQ7ICAvLyDjgrLjg7zjg6Dmg4XloLHooajnpLrnlKjjga5IVE1M6KaB57SgXG4gICAgcHJpdmF0ZSBzdGFydEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7ICAgLy8g44Ky44O844Og44K544K/44O844OI44Oc44K/44Oz55So44GuSFRNTOimgee0oFxuICAgIHByaXZhdGUgcmVzdGFydEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7IC8vIOODquODiOODqeOCpOODnOOCv+ODs+eUqOOBrkhUTUzopoHntKBcbiAgICBwcml2YXRlIGluc3RydWN0aW9uc0RpdjogSFRNTERpdkVsZW1lbnQ7ICAvLyDmk43kvZzoqqzmmI7nlKjjga5IVE1M6KaB57SgXG4gICAgcHJpdmF0ZSBnYW1lT3ZlckRpc3BsYXlEaXY6IEhUTUxEaXZFbGVtZW50OyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7znlKjjga5IVE1M6KaB57SgXG5cbiAgICAvLyDokL3kuIvjgqzjgqTjg4lcbiAgICBwcml2YXRlIGRyb3BHdWlkZU1lc2g6IFRIUkVFLk1lc2g7IC8vIOiQveS4i+OCrOOCpOODieODoeODg+OCt+ODpVxuXG4gICAgLy8g44OR44O844OG44Kj44Kv44Or6Zai6YCjXG4gICAgcHJpdmF0ZSBjbG91ZDogVEhSRUUuUG9pbnRzOyAgIC8vIOODkeODvOODhuOCo+OCr+ODq+e+pOOBruODoeOCpOODs+OCquODluOCuOOCp+OCr+ODiFxuICAgIHByaXZhdGUgcGFydGljbGVWZWxvY2l0eTogVEhSRUUuVmVjdG9yM1tdID0gW107IC8vIOWQhOODkeODvOODhuOCo+OCr+ODq+OBrumAn+W6puOCkuS/neaMgeOBmeOCi+mFjeWIl1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFydGljbGVBcmVhU2l6ZTogbnVtYmVyID0gNDA7IC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOWIhuW4g+OBmeOCi+epuumWk+OBruOCteOCpOOCulxuICAgIFxuICAgIC8vIOODq+ODvOODl+WItuW+oUlEXG4gICAgcHJpdmF0ZSBwaHlzaWNzQW5kUGFydGljbGVGcmFtZUlkOiBudW1iZXI7IC8vIOeJqeeQhua8lOeul+OBqOODkeODvOODhuOCo+OCr+ODq+OBruODq+ODvOODl+OBrklEXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKVxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgxYTFhMmUpKTsgLy8g5pqX44GE6Z2S57Sr44Gu44KI44GG44Gq6ImyXG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgIC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy8g44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg1MCwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIC8vY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAxMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgICAgICBvcmJpdENvbnRyb2xzLnRhcmdldC5zZXQoMCwgNiwgMCk7IFxuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcblxuICAgICAgICAvLyBVSeimgee0oOOBrueUn+aIkOOBqOWIneacn+ioreWumlxuICAgICAgICAvLyDjgrLjg7zjg6Dmg4XloLFcbiAgICAgICAgdGhpcy5pbmZvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS50b3AgPSAnMjBweCc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5sZWZ0ID0gJzIwcHgnO1xuICAgICAgICB0aGlzLmluZm9EaXYuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLmluZm9EaXYuc3R5bGUuZm9udFNpemUgPSAnMTZweCc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjUpJztcbiAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLnBhZGRpbmcgPSAnOHB4JztcbiAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaW5mb0Rpdik7XG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUluZm8oKTtcblxuICAgICAgICAvLyDjgrLjg7zjg6Djgrnjgr/jg7zjg4hcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gJ+OCsuODvOODoOOCueOCv+ODvOODiCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLnRvcCA9ICcxMzBweCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUubGVmdCA9ICczNDBweCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnMTVweCAzMHB4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9ICcyNnB4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzRDQUY1MCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnN3B4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5zdGFydEJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaTjeS9nOiqrOaYjlxuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLnRvcCA9ICcyMzBweCc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLmxlZnQgPSAnMTkzcHgnO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLmZvbnRTaXplID0gJzE1cHgnO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUucGFkZGluZyA9ICcxMHB4JztcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8aDM+5pON5L2c5pa55rOVPC9oMz5cbiAgICAgICAgICAgIDxwPuKXgCDilrYg4payIOKWvCA6IOODluODreODg+OCr+OCkuawtOW5s+enu+WLlTwvcD5cbiAgICAgICAgICAgIDxwPuOCueODmuODvOOCueOCreODvCA6IOODluODreODg+OCr+OCkljou7jlkajjgorjgavlm57ou6I8L3A+XG4gICAgICAgICAgICA8cD5FbnRlcuOCreODvCA6IOODluODreODg+OCr+OCkuiQveS4izwvcD5cbiAgICAgICAgYDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmluc3RydWN0aW9uc0Rpdik7XG5cbiAgICAgICAgLy8g44Oq44OI44Op44Kk44Oc44K/44OzXG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSAn44Oq44OI44Op44KkJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnRvcCA9ICczMDBweCc7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5sZWZ0ID0gJzM0MHB4JztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnMTBweCAyMHB4JztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzI2cHgnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmNDQzMzYnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gJzhweCc7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVzdGFydEJ1dHRvbik7XG5cbiAgICAgICAgLy8g44Ky44O844Og44Kq44O844OQ44O86KGo56S6XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUudG9wID0gJzEzMHB4JztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUubGVmdCA9ICczNDBweCc7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5mb250U2l6ZSA9ICczMHB4JztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZm9udFdlaWdodCA9ICdib2xkJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknOyAvLyDljYrpgI/mmI7jga7pu5Log4zmma9cbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUucGFkZGluZyA9ICcyMHB4IDMwcHgnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTBweCc7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLmJvcmRlciA9ICcycHggc29saWQgd2hpdGUnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2KTtcblxuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0R2FtZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zRGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbmZvRGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsMCwwLDAuNSknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweDFhMWEyZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvLyDjg5fjg6zjgqTjg6Tjg7zjga7mk43kvZzjgavlkIjjgo/jgZvjgabjg5fjg6zjg5Pjg6Xjg7zjga7kvY3nva7jgajlm57ou6LjgpLmm7TmlrBcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnBvc2l0aW9uLnggPSB0aGlzLnRhcmdldFNwYXduWDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5wb3NpdGlvbi56ID0gdGhpcy50YXJnZXRTcGF3blo7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueSA9IHRoaXMuc3Bhd25ZUG9zaXRpb247XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keS5wb3NpdGlvbi5zZXQodGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueCwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueSwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0JvZHkucXVhdGVybmlvbi5zZXQodGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi54LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLnksIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueiwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi53KTtcblxuICAgICAgICAgICAgICAgIC8vIOiQveS4i+OCrOOCpOODieODoeODg+OCt+ODpeOBruihqOekuueKtuaFi+OBqOS9jee9ruODu+Wbnui7ouOBruabtOaWsFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnBvc2l0aW9uLnggPSB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gucG9zaXRpb24ueiA9IHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnBvc2l0aW9uLno7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC5wb3NpdGlvbi55ID0gMC4wMDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC5xdWF0ZXJuaW9uLnNldCh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLngsIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueSwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi56LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG5cbiAgICAgICAgLy8g44Kt44O844Oc44O844OJ44Kk44OZ44Oz44OIXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIOOCsuODvOODoOOCueOCv+ODvOODiFxuICAgICAgICAgICAgaWYgKCF0aGlzLmdhbWVTdGFydGVkICYmIGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOOCsuODvOODoOOCquODvOODkOODvOaZguOBq0VudGVy44Gn44Oq44OI44Op44KkXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lT3ZlciAmJiBldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVzdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJzsgLy8g44Oq44OI44Op44Kk44Oc44K/44Oz44KS6Z2e6KGo56S644GrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IC8vIOOCueOCv+ODvOODiOODnOOCv+ODs+OCkuihqOekuuOBq1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnNEaXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IC8vIOaTjeS9nOiqrOaYjuOCkuihqOekuuOBq1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmZvRGl2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjUpJzsgLy8g5oOF5aCx44OR44ON44Or44Gu6Imy44KS5YWD44Gr5oi744GZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWVPdmVyRGlzcGxheURpdikgeyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zooajnpLrjgpLpnZ7ooajnpLrjgavjgZnjgotcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKDB4MWExYTJlKTsgLy8g6IOM5pmv6Imy44KS5YWD44Gr5oi744GZXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDjgrLjg7zjg6DjgYzplovlp4vjgZXjgozjgabjgIHjgrLjg7zjg6Djgqrjg7zjg5Djg7zjgafjga/jgarjgYTjgajjgY1cbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVTdGFydGVkICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55+i5Y2w44Gn56e75YuVXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6IFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25YID0gTWF0aC5tYXgoLXRoaXMubWF4TW92ZVJhbmdlLCB0aGlzLnRhcmdldFNwYXduWCAtIHRoaXMubW92ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzogXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRTcGF3blggPSBNYXRoLm1pbih0aGlzLm1heE1vdmVSYW5nZSwgdGhpcy50YXJnZXRTcGF3blggKyB0aGlzLm1vdmVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6IFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25aID0gTWF0aC5tYXgoLXRoaXMubWF4TW92ZVJhbmdlLCB0aGlzLnRhcmdldFNwYXduWiAtIHRoaXMubW92ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25aID0gTWF0aC5taW4odGhpcy5tYXhNb3ZlUmFuZ2UsIHRoaXMudGFyZ2V0U3Bhd25aICsgdGhpcy5tb3ZlU3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8g44K544Oa44O844K544Kt44O844Gn5Zue6LuiXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyAnOiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UHJldmlld01lc2ggJiYgdGhpcy5jdXJyZW50UHJldmlld0JvZHkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnJvdGF0aW9uLnggKz0gTWF0aC5QSSAvIDI7IC8vIFjou7jlkajjgorjgas5MOW6puWbnui7olxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdCb2R5LnF1YXRlcm5pb24uc2V0KHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueCwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi55LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLnosIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBFbnRlcuOCreODvOOBp+iQveS4i1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuRHJvcE9iamVjdCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5Ecm9wT2JqZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44OX44Os44OT44Ol44O844GL44KJ54mp55CG44G4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHRoaXMuY3VycmVudFByZXZpZXdCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1YmVNZXNoZXMucHVzaCh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJlQm9kaWVzLnB1c2godGhpcy5jdXJyZW50UHJldmlld0JvZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOODl+ODrOODk+ODpeODvOOCkuOCr+ODquOColxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Ks44Kk44OJ44KS6Z2e6KGo56S6ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Kv44O844Or44OA44Km44OzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuRHJvcE9iamVjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5nYW1lT3Zlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGF3bk5leHRPYmplY3RGb3JQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLmRyb3BDb29sZG93biAqIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIC8vIOeJqeeQhua8lOeul+ODr+ODvOODq+ODiVxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7IGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCkgfSk7XG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuOTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wMTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uKTtcblxuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgZ3JvdW5kU2l6ZSA9IDQ7XG4gICAgICAgIGNvbnN0IGdyb3VuZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KGdyb3VuZFNpemUsIDAuNSwgZ3JvdW5kU2l6ZSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4YzdjNGJkLCByb3VnaG5lc3M6IDAuOCwgbWV0YWxuZXNzOiAwLjEgfSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1lc2ggPSBuZXcgVEhSRUUuTWVzaChncm91bmRHZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgICBncm91bmRNZXNoLnBvc2l0aW9uLnkgPSAtMC4yNTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JvdW5kTWVzaCk7XG5cbiAgICAgICAgY29uc3QgZ3JvdW5kU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoZ3JvdW5kU2l6ZSAvIDIsIDAuNSwgZ3JvdW5kU2l6ZSAvIDIpKTtcbiAgICAgICAgY29uc3QgZ3JvdW5kQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAsIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTAuMjUsIDApfSk7XG4gICAgICAgIGdyb3VuZEJvZHkuYWRkU2hhcGUoZ3JvdW5kU2hhcGUpO1xuICAgICAgICBncm91bmRCb2R5LnBvc2l0aW9uLnNldChncm91bmRNZXNoLnBvc2l0aW9uLngsIGdyb3VuZE1lc2gucG9zaXRpb24ueSwgZ3JvdW5kTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgZ3JvdW5kQm9keS5xdWF0ZXJuaW9uLnNldChncm91bmRNZXNoLnF1YXRlcm5pb24ueCwgZ3JvdW5kTWVzaC5xdWF0ZXJuaW9uLnksIGdyb3VuZE1lc2gucXVhdGVybmlvbi56LCBncm91bmRNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShncm91bmRCb2R5KTtcblxuICAgICAgICAvLyDjg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQoMTAsIDIwLCAxMCk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIC8vIOiQveS4i+OCrOOCpOODieODoeODg+OCt+ODpeOBruWIneacn+WMllxuICAgICAgICBjb25zdCBndWlkZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmZmZjAwLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pO1xuICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKSwgZ3VpZGVNYXRlcmlhbCk7XG4gICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC5wb3NpdGlvbi55ID0gMC4wMTsgICAvLyDlnLDpnaLjgojjgorjgo/jgZrjgYvjgavmta7jgYvjgZvjgotcbiAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5kcm9wR3VpZGVNZXNoKTtcblxuICAgICAgICAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjga7nlJ/miJBcbiAgICAgICAgbGV0IGNyZWF0ZVBhcnRpY2xlc0xvY2FsID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8g44K444Kq44Oh44OI44Oq44Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcblxuICAgICAgICAgICAgbGV0IGdlbmVyYXRlU3ByaXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8v5paw44GX44GE44Kt44Oj44Oz44OQ44K544Gu5L2c5oiQXG4gICAgICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IDE2O1xuICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSAxNjtcblxuICAgICAgICAgICAgICAgIC8vIOWGhuW9ouOBruOCsOODqeODh+ODvOOCt+ODp+ODs+OBruS9nOaIkFxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICAgICAgaWYgKCFjb250ZXh0KSByZXR1cm4gbmV3IFRIUkVFLlRleHR1cmUoKTsgXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhZGllbnQgPSBjb250ZXh0LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyLCAwLCBjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMiwgY2FudmFzLndpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMiwgJ3JnYmEoMCwxOTEsMjU1LDEpJyk7XG4gICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNCwgJ3JnYmEoMCwwLDEyOCwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLDAsMCwxKScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgICAgICAgIC8vIOODhuOCr+OCueODgeODo+OBrueUn+aIkFxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuICAgICAgICAgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0dXJlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8g44Oe44OG44Oq44Ki44Or44Gu5L2c5oiQXG4gICAgICAgICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRzTWF0ZXJpYWwoeyBcbiAgICAgICAgICAgICAgICBzaXplOiAxLjAsIFxuICAgICAgICAgICAgICAgIG1hcDogZ2VuZXJhdGVTcHJpdGUoKSxcbiAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcbiAgICAgICAgICAgICAgICBjb2xvcjogMHhGRkZGRkYsIFxuICAgICAgICAgICAgICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6MC44XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gcGFydGljbGXjga7kvZzmiJBcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlTnVtID0gMTAwMDtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkocGFydGljbGVOdW0gKiAzKTtcbiAgICAgICAgICAgIGxldCBwYXJ0aWNsZUluZGV4ID0gMDtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVWZWxvY2l0eSA9IFtdO1xuXG4gICAgICAgICAgICAvLyDlkITjg5Hjg7zjg4bjgqPjgq/jg6vjga7liJ3mnJ/kvY3nva7jgajpgJ/luqbjgpLoqK3lrppcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVOdW07IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnBhcnRpY2xlQXJlYVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMucGFydGljbGVBcmVhU2l6ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wYXJ0aWNsZUFyZWFTaXplO1xuXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSB4O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0geTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IHo7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB2eCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDAuMTtcbiAgICAgICAgICAgICAgICBjb25zdCB2eSA9IC0oMC41ICsgTWF0aC5yYW5kb20oKSAqIDAuNSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdnogPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjE7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVZlbG9jaXR5LnB1c2gobmV3IFRIUkVFLlZlY3RvcjModngsIHZ5LCB2eikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLDMpKTtcblxuICAgICAgICAgICAgLy8gVEhSRUUuUG9pbnRz44Gu5L2c5oiQXG4gICAgICAgICAgICB0aGlzLmNsb3VkID0gbmV3IFRIUkVFLlBvaW50cyhnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jbG91ZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGVQYXJ0aWNsZXNMb2NhbCgpOyAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vnlJ/miJDplqLmlbDjgpLlkbzjgbPlh7rjgZlcblxuICAgICAgICAvLyDniannkIbmvJTnrpfjgajjg5Hjg7zjg4bjgqPjgq/jg6vjgpLmm7TmlrBcbiAgICAgICAgY29uc3QgcGh5c2ljc0FuZFBhcnRpY2xlQ2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICAgICAgY29uc3QgdXBkYXRlUGh5c2ljc0FuZFBhcnRpY2xlczogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgLy8g44Ky44O844Og6ZaL5aeL44GV44KM44Gm44CB44Ky44O844Og44Kq44O844OQ44O844Gn44Gv44Gq44GE5aC05ZCI44Gu44G/5pu05pawXG4gICAgICAgICAgICBpZih0aGlzLmdhbWVTdGFydGVkICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGFUaW1lID0gcGh5c2ljc0FuZFBhcnRpY2xlQ2xvY2suZ2V0RGVsdGEoKTsgICAvLyDliY3lm57jga7niannkIbmm7TmlrDjgYvjgonjga7ntYzpgY7mmYLplpNcbiAgICAgICAgICAgICAgICAvLyDniannkIbmvJTnrpfjga7mm7TmlrBcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLnN0ZXAoMSAvIDYwLCBkZWx0YVRpbWUsIDEwKTtcblxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmN1YmVNZXNoZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJlTWVzaGVzW2ldLnBvc2l0aW9uLnNldCh0aGlzLmN1YmVCb2RpZXNbaV0ucG9zaXRpb24ueCwgdGhpcy5jdWJlQm9kaWVzW2ldLnBvc2l0aW9uLnksIHRoaXMuY3ViZUJvZGllc1tpXS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJlTWVzaGVzW2ldLnF1YXRlcm5pb24uc2V0KHRoaXMuY3ViZUJvZGllc1tpXS5xdWF0ZXJuaW9uLngsIHRoaXMuY3ViZUJvZGllc1tpXS5xdWF0ZXJuaW9uLnksIHRoaXMuY3ViZUJvZGllc1tpXS5xdWF0ZXJuaW9uLnosIHRoaXMuY3ViZUJvZGllc1tpXS5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgYzlnLDpnaLjga7kuIvjgavokL3jgaHjgZ/loLTlkIhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY3ViZUJvZGllc1tpXS5wb3NpdGlvbi55IDwgLTUgJiYgdGhpcy5jdWJlQm9kaWVzW2ldLm1hc3MgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZhaWx1cmVDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5yZW1vdmVCb2R5KHRoaXMuY3ViZUJvZGllc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZSh0aGlzLmN1YmVNZXNoZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJlQm9kaWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3ViZU1lc2hlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbWVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyA15YCL6JC944Gh44Gf44KJXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mYWlsdXJlQ291bnQgPj0gdGhpcy5tYXhGYWlsdXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcEdhbWVMb2dpYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOODkeODvOODhuOCo+OCr+ODq+OBruS9jee9ruabtOaWsFxuICAgICAgICAgICAgICAgIGNvbnN0IGdlb20gPSA8VEhSRUUuQnVmZmVyR2VvbWV0cnk+dGhpcy5jbG91ZC5nZW9tZXRyeTtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBnZW9tLmdldEF0dHJpYnV0ZSgncG9zaXRpb24nKTsgXG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jb3VudDsgaSsrKSB7IFxuICAgICAgICAgICAgICAgICAgICBsZXQgeCA9IHBvc2l0aW9ucy5nZXRYKGkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeSA9IHBvc2l0aW9ucy5nZXRZKGkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgeiA9IHBvc2l0aW9ucy5nZXRaKGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy5wYXJ0aWNsZVZlbG9jaXR5W2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHggKz0gdmVsb2NpdHkueCAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgeSArPSB2ZWxvY2l0eS55ICogZGVsdGFUaW1lO1xuICAgICAgICAgICAgICAgICAgICB6ICs9IHZlbG9jaXR5LnogKiBkZWx0YVRpbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g44OR44O844OG44Kj44Kv44Or44GM55S76Z2i5LiL56uv44KS6LaF44GI44Gf44KJ5LiK44Gr5oi744GZXG4gICAgICAgICAgICAgICAgICAgIGlmICh5IDwgLXRoaXMucGFydGljbGVBcmVhU2l6ZSAvIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSB0aGlzLnBhcnRpY2xlQXJlYVNpemUgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMucGFydGljbGVBcmVhU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHogPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnBhcnRpY2xlQXJlYVNpemU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFgoaSwgeCk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRZKGksIHkpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WihpLCB6KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR2FtZUluZm8oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQaHlzaWNzQW5kUGFydGljbGVzKTsgXG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVBoeXNpY3NBbmRQYXJ0aWNsZXMpOyBcbiAgICB9XG5cbiAgICAvLyDjgrLjg7zjg6Dplovlp4vmmYLjgavlkbzjgbPlh7rjgZnjg6Hjgr3jg4Pjg4lcbiAgICBwcml2YXRlIHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5nYW1lU3RhcnRlZCA9IHRydWU7ICAgIC8vIOOCsuODvOODoOmWi+Wni1xuICAgICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmFpbHVyZUNvdW50ID0gMDsgIC8vIOWkseaVl+WbnuaVsOOCkuODquOCu+ODg+ODiFxuICAgICAgICB0aGlzLm1heFN0YWNrSGVpZ2h0ID0gMDsgICAgLy8g5pyA6auY6auY44GV44KS44Oq44K744OD44OIXG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUluZm8oKTsgIC8vIFVJ5oOF5aCx44KS5pu05pawXG4gICAgICAgIHRoaXMuc3Bhd25OZXh0T2JqZWN0Rm9yUHJldmlldygpOyAgIC8vIOacgOWIneOBruODluODreODg+OCr+OCkuODl+ODrOODk+ODpeODvOihqOekulxuXG4gICAgICAgIC8vIFVJ6KaB57Sg44Gu6KGo56S6L+mdnuihqOekuuOBruWIh+OCiuabv+OBiFxuICAgICAgICBpZiAodGhpcy5zdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyAvLyDjgrnjgr/jg7zjg4jjg5zjgr/jg7PjgpLpnZ7ooajnpLpcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnNEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7IC8vIOaTjeS9nOiqrOaYjuOCkumdnuihqOekulxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweDFhMWEyZSk7IC8vIOiDjOaZr+iJsuOCkuWIneacn+eKtuaFi+OBq+aIu+OBmVxuICAgIH1cblxuICAgIC8vIOOCsuODvOODoOeKtuaFi+OCkuODquOCu+ODg+ODiOOBl+OAgeWIneacn+eKtuaFi+OBq+aIu+OBmeODoeOCveODg+ODiVxuICAgIHByaXZhdGUgcmVzZXRHYW1lID0gKCkgPT4ge1xuICAgICAgICAvLyDjgrfjg7zjg7PjgajniannkIbjg6/jg7zjg6vjg4njgYvjgonml6LlrZjjga7jg5bjg63jg4Pjgq/jgpLjgZnjgbnjgabliYrpmaRcbiAgICAgICAgdGhpcy5jdWJlTWVzaGVzLmZvckVhY2gobWVzaCA9PiB0aGlzLnNjZW5lLnJlbW92ZShtZXNoKSk7XG4gICAgICAgIHRoaXMuY3ViZUJvZGllcy5mb3JFYWNoKGJvZHkgPT4gdGhpcy53b3JsZC5yZW1vdmVCb2R5KGJvZHkpKTtcbiAgICAgICAgdGhpcy5jdWJlTWVzaGVzID0gW107IC8vIOmFjeWIl+OCkuOCr+ODquOColxuICAgICAgICB0aGlzLmN1YmVCb2RpZXMgPSBbXTsgLy8g6YWN5YiX44KS44Kv44Oq44KiXG5cbiAgICAgICAgLy8g44Ky44O844Og54q25oWL44OV44Op44Kw44KS44Oq44K744OD44OIXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1heFN0YWNrSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5mYWlsdXJlQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnRhcmdldFNwYXduWCA9IDA7XG4gICAgICAgIHRoaXMudGFyZ2V0U3Bhd25aID0gMDtcbiAgICAgICAgdGhpcy5jYW5Ecm9wT2JqZWN0ID0gdHJ1ZTtcblxuICAgICAgICAvLyDjg5fjg6zjg5Pjg6Xjg7zjgqrjg5bjgrjjgqfjgq/jg4jjgajokL3kuIvjgqzjgqTjg4njgpLliYrpmaQv6Z2e6KGo56S6XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5jdXJyZW50UHJldmlld01lc2gpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld01lc2ggPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0JvZHkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVHYW1lSW5mbygpOyAvLyBVSeaDheWgseOCkuabtOaWsFxuXG4gICAgICAgIC8vIOODquOCu+ODg+ODiOaZguOBq+eJqeeQhua8lOeul+OBqOODkeODvOODhuOCo+OCr+ODq+abtOaWsOODq+ODvOODl+OCkuWBnOatolxuICAgICAgICBpZiAodGhpcy5waHlzaWNzQW5kUGFydGljbGVGcmFtZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnBoeXNpY3NBbmRQYXJ0aWNsZUZyYW1lSWQpO1xuICAgICAgICAgICAgdGhpcy5waHlzaWNzQW5kUGFydGljbGVGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOasoeOBq+iQveS4i+OBleOBm+OCi+OCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkOOBqOODl+ODrOODk+ODpeODvOihqOekuuOBmeOCi+ODoeOCveODg+ODiVxuICAgIHByaXZhdGUgc3Bhd25OZXh0T2JqZWN0Rm9yUHJldmlldyA9ICgpID0+IHtcbiAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Gu44Op44Oz44OA44Og44Gq44K144Kk44K644KS5rG65a6aXG4gICAgICAgIGNvbnN0IG1pblNpemUgPSAwLjU7IC8vIOOCquODluOCuOOCp+OCr+ODiOOBruacgOWwj+OCteOCpOOCulxuICAgICAgICBjb25zdCBtYXhTaXplID0gMS4wOyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjga7mnIDlpKfjgrXjgqTjgrpcbiAgICAgICAgY29uc3QgcmFuZG9tU2l6ZSA9IG1pblNpemUgKyAoTWF0aC5yYW5kb20oKSAqIChtYXhTaXplIC0gbWluU2l6ZSkpOyBcblxuICAgICAgICAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjga7lvaLnirbjgr/jgqTjg5fjgpLlrprnvqlcbiAgICAgICAgY29uc3QgZ2VvbWV0cmllcyA9IFtcbiAgICAgICAgICAgIC8vIOaomea6lueahOOBqueri+aWueS9k1xuICAgICAgICAgICAgeyBnZW86IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShyYW5kb21TaXplLCByYW5kb21TaXplLCByYW5kb21TaXplKSwgY2Fubm9uU2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhyYW5kb21TaXplIC8gMiwgcmFuZG9tU2l6ZSAvIDIsIHJhbmRvbVNpemUgLyAyKSkgfSxcbiAgICAgICAgICAgIC8vIOW5heW6g+OBruW5s+OBn+OBhOebtOaWueS9kyAo5p2/54q2KVxuICAgICAgICAgICAgeyBnZW86IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShyYW5kb21TaXplICogMi4wLCByYW5kb21TaXplICogMC41LCByYW5kb21TaXplICogMS41KSwgY2Fubm9uU2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhyYW5kb21TaXplICogMS4wLCByYW5kb21TaXplICogMC4yNSwgcmFuZG9tU2l6ZSAqIDAuNzUpKSB9LFxuICAgICAgICAgICAgLy8g57Sw6ZW344GE55u05pa55L2TICjmo5LnirYpXG4gICAgICAgICAgICB7IGdlbzogbmV3IFRIUkVFLkJveEdlb21ldHJ5KHJhbmRvbVNpemUgKiAwLjUsIHJhbmRvbVNpemUgKiAyLjUsIHJhbmRvbVNpemUgKiAwLjUpLCBjYW5ub25TaGFwZTogbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHJhbmRvbVNpemUgKiAwLjI1LCByYW5kb21TaXplICogMS4yNSwgcmFuZG9tU2l6ZSAqIDAuMjUpKSB9LFxuICAgICAgICAgICAgLy8g5bCR44GX5aSn44GN44KB44Gu56uL5pa55L2TXG4gICAgICAgICAgICB7IGdlbzogbmV3IFRIUkVFLkJveEdlb21ldHJ5KHJhbmRvbVNpemUgKiAxLjIsIHJhbmRvbVNpemUgKiAxLjIsIHJhbmRvbVNpemUgKiAxLjIpLCBjYW5ub25TaGFwZTogbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHJhbmRvbVNpemUgKiAwLjYsIHJhbmRvbVNpemUgKiAwLjYsIHJhbmRvbVNpemUgKiAwLjYpKSB9LFxuICAgICAgICAgICAgLy8g5q2j5Y2B5LqM6Z2i5L2TXG4gICAgICAgICAgICB7IGdlbzogbmV3IFRIUkVFLkRvZGVjYWhlZHJvbkdlb21ldHJ5IChyYW5kb21TaXplICogMC43LCAwKSwgY2Fubm9uU2hhcGU6IG5ldyBDQU5OT04uU3BoZXJlKHJhbmRvbVNpemUgKiAwLjcpIH1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgc2VsZWN0ZWRUeXBlO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMSkgeyAvLyAxMCXjga7norrnjofjgaflpJrpnaLkvZPjgpLpgbjmip5cbiAgICAgICAgICAgIHNlbGVjdGVkVHlwZSA9IGdlb21ldHJpZXNbNF07IC8vIOWkmumdouS9k1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g5q6L44KK44GuOTAl44Gv56uL5pa55L2T44O755u05pa55L2T44Gu5Lit44GL44KJ44Op44Oz44OA44Og44Gr6YG45oqeXG4gICAgICAgICAgICBzZWxlY3RlZFR5cGUgPSBnZW9tZXRyaWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChnZW9tZXRyaWVzLmxlbmd0aCAtIDEpKV07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBzZWxlY3RlZFR5cGUuZ2VvO1xuICAgICAgICBjb25zdCBjYW5ub25TaGFwZSA9IHNlbGVjdGVkVHlwZS5jYW5ub25TaGFwZTtcblxuICAgICAgICAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjga7oibLjgpLjg6njg7Pjg4Djg6Djgavpgbjmip5cbiAgICAgICAgY29uc3QgY29sb3JzID0gW1xuICAgICAgICAgICAgMHgwMEZGRkYsIC8vIOOCt+OCouODsyAo5piO44KL44GE5rC06ImyKVxuICAgICAgICAgICAgMHhGRkZGMDAsIC8vIOOCpOOCqOODreODvCAo5piO44KL44GE6buE6ImyKVxuICAgICAgICAgICAgMHhGRjAwRkYsIC8vIOODnuOCvOODs+OCvyAo5piO44KL44GE57Sr44OU44Oz44KvKVxuICAgICAgICAgICAgMHgwMEZGMDAsIC8vIOmuruOChOOBi+OBque3kVxuICAgICAgICAgICAgMHhGRjY2MDAsIC8vIOmuruOChOOBi+OBquOCquODrOODs+OCuFxuICAgICAgICAgICAgMHhGRjMzRkYgIC8vIOODm+ODg+ODiOODlOODs+OCr1xuICAgICAgICBdO1xuICAgICAgICBjb25zdCByYW5kb21Db2xvciA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3JzLmxlbmd0aCldKTtcbiAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Gu44Oe44OG44Oq44Ki44OrXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IHJhbmRvbUNvbG9yLCByb3VnaG5lc3M6IDAuNSwgbWV0YWxuZXNzOiAwLjIgfSk7XG5cbiAgICAgICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgIG1lc2gucG9zaXRpb24uc2V0KHRoaXMudGFyZ2V0U3Bhd25YLCB0aGlzLnNwYXduWVBvc2l0aW9uLCB0aGlzLnRhcmdldFNwYXduWik7IFxuICAgICAgICBtZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChtZXNoKTtcblxuICAgICAgICBjb25zdCBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgIG1hc3M6IDEsIFxuICAgICAgICAgICAgc2hhcGU6IGNhbm5vblNoYXBlLFxuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyhtZXNoLnBvc2l0aW9uLngsIG1lc2gucG9zaXRpb24ueSwgbWVzaC5wb3NpdGlvbi56KSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgMC4xLCAwKVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoID0gbWVzaDtcbiAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0JvZHkgPSBib2R5O1xuXG4gICAgICAgIC8vIOiQveS4i+OCrOOCpOODieOBruabtOaWsFxuICAgICAgICBpZiAodGhpcy5kcm9wR3VpZGVNZXNoKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2guZ2VvbWV0cnkgPSBnZW9tZXRyeS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g44Ky44O844Og5oOF5aCx44KS5pu05paw44GX44Gm44CB6KGo56S644GZ44KL44Oh44K944OD44OJXG4gICAgcHJpdmF0ZSB1cGRhdGVHYW1lSW5mbyA9ICgpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRNYXhIZWlnaHQgPSAwO1xuICAgICAgICAvLyDnj77lnKjjga7jg5bjg63jg4Pjgq/jga7kuK3jgafmnIDjgoLpq5jjgYRZ5bqn5qiZ44KS6KaL44Gk44GR44KLXG4gICAgICAgIHRoaXMuY3ViZU1lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xuICAgICAgICAgICAgaWYgKG1lc2gucG9zaXRpb24ueSA+IGN1cnJlbnRNYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50TWF4SGVpZ2h0ID0gbWVzaC5wb3NpdGlvbi55O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8g5pyA6auY56mN44G/5LiK44GS6auY44GV44KS6KiI566XXG4gICAgICAgIHRoaXMubWF4U3RhY2tIZWlnaHQgPSBNYXRoLm1heCgwLCBjdXJyZW50TWF4SGVpZ2h0IC0gMC41KTsgXG4gICAgICAgIC8vIOaDheWgseOBruabtOaWsFxuICAgICAgICBpZiAodGhpcy5pbmZvRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmluZm9EaXYuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIEZhaWx1cmVzOiAke3RoaXMuZmFpbHVyZUNvdW50fSAvICR7dGhpcy5tYXhGYWlsdXJlc308YnI+XG4gICAgICAgICAgICAgICAgSGVpZ2h0OiAke3RoaXMubWF4U3RhY2tIZWlnaHQudG9GaXhlZCgyKX1tXG4gICAgICAgICAgICBgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g44Ky44O844Og44KS57WC5LqG44GZ44KL44Oh44K944OD44OJXG4gICAgcHJpdmF0ZSBzdG9wR2FtZUxvZ2ljID0gKCkgPT4ge1xuICAgICAgICAvLyDli5XjgY3jgpLmraLjgoHjgotcbiAgICAgICAgdGhpcy5jdWJlQm9kaWVzLmZvckVhY2goYm9keSA9PiB7XG4gICAgICAgICAgICBib2R5Lm1hc3MgPSAwO1xuICAgICAgICAgICAgYm9keS52ZWxvY2l0eS5zZXQoMCwwLDApO1xuICAgICAgICAgICAgYm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0KDAsMCwwKTtcbiAgICAgICAgICAgIGJvZHkuYWxsb3dTbGVlcCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyDjg5fjg6zjg5Pjg6Xjg7xcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFByZXZpZXdNZXNoKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZSh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8g6JC95LiL44Ks44Kk44OJ44KS6Z2e6KGo56S6XG4gICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8g44Oq44OI44Op44Kk44Oc44K/44Oz44KS6KGo56S644GZ44KLXG4gICAgICAgIGlmICh0aGlzLnJlc3RhcnRCdXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgICAvLyDmg4XloLHjg5Hjg43jg6vjga7og4zmma/oibLjga7jgb/lpInmm7RcbiAgICAgICAgaWYgKHRoaXMuaW5mb0Rpdikge1xuICAgICAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDI1NSwwLDAsMC43KSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8g44K344O844Oz44Gu6IOM5pmv6Imy44KS6LWk44GP44GZ44KLXG4gICAgICAgIHRoaXMuc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweDhCMDAwMCk7XG4gICAgICAgIC8vIOOCsuODvOODoOOCquODvOODkOODvOOCkuihqOekulxuICAgICAgICBpZiAodGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICBHQU1FIE9WRVIhPGJyPlxuICAgICAgICAgICAgICAgIOacgOW+jOOBrumrmOOBlTogJHt0aGlzLm1heFN0YWNrSGVpZ2h0LnRvRml4ZWQoMil9bVxuICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9XG4gICAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDE1LCAxNSkpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==