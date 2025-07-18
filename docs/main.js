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
        const groundShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(groundSize / 2, 0.25, groundSize / 2));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErQjtBQUMyQztBQUN0QztBQUVwQyxNQUFNLGdCQUFnQjtJQUNWLEtBQUssQ0FBYztJQUNuQixLQUFLLENBQWM7SUFDbkIsS0FBSyxDQUFlO0lBQ3BCLFVBQVUsR0FBaUIsRUFBRSxDQUFDO0lBQzlCLFVBQVUsR0FBa0IsRUFBRSxDQUFDO0lBRXZDLFdBQVc7SUFDSCxXQUFXLEdBQVksS0FBSyxDQUFDLENBQUcsYUFBYTtJQUM3QyxRQUFRLEdBQVksS0FBSyxDQUFDLENBQUUsWUFBWTtJQUVoRCxRQUFRO0lBQ0EsY0FBYyxHQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVc7SUFDdkMsWUFBWSxHQUFXLENBQUMsQ0FBQyxDQUFDLGVBQWU7SUFDaEMsV0FBVyxHQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtJQUUzRCxnQkFBZ0I7SUFDUixZQUFZLEdBQVcsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO0lBQ2hELFlBQVksR0FBVyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7SUFDdkMsU0FBUyxHQUFXLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQjtJQUMxQyxZQUFZLEdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1CO0lBQzlDLGNBQWMsR0FBVyxFQUFFLENBQUMsQ0FBQyxrQkFBa0I7SUFFaEUscUJBQXFCO0lBQ2Isa0JBQWtCLENBQWEsQ0FBQyx3QkFBd0I7SUFDeEQsa0JBQWtCLENBQWMsQ0FBQyx3QkFBd0I7SUFFakUsS0FBSztJQUNHLGFBQWEsR0FBWSxJQUFJLENBQUMsQ0FBRSxjQUFjO0lBQ3JDLFlBQVksR0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXO0lBRXZELE9BQU87SUFDQyxPQUFPLENBQWlCLENBQUUsa0JBQWtCO0lBQzVDLFdBQVcsQ0FBb0IsQ0FBRyxxQkFBcUI7SUFDdkQsYUFBYSxDQUFvQixDQUFDLGtCQUFrQjtJQUNwRCxlQUFlLENBQWlCLENBQUUsZUFBZTtJQUNqRCxrQkFBa0IsQ0FBaUIsQ0FBQyxrQkFBa0I7SUFFOUQsUUFBUTtJQUNBLGFBQWEsQ0FBYSxDQUFDLFlBQVk7SUFFL0MsV0FBVztJQUNILEtBQUssQ0FBZSxDQUFHLG9CQUFvQjtJQUMzQyxnQkFBZ0IsR0FBb0IsRUFBRSxDQUFDLENBQUMsb0JBQW9CO0lBQ25ELGdCQUFnQixHQUFXLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQjtJQUVwRSxVQUFVO0lBQ0YseUJBQXlCLENBQVMsQ0FBQyxxQkFBcUI7SUFFaEU7SUFDQSxDQUFDO0lBRUQsb0JBQW9CO0lBQ2IsaUJBQWlCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBYyxFQUFFLFNBQXdCLEVBQUUsRUFBRTtRQUNuRixNQUFNLFFBQVEsR0FBRyxJQUFJLGdEQUFtQixFQUFFLENBQUM7UUFDM0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHdDQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVk7UUFDL0QsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUUsZUFBZTtRQUVuRCxTQUFTO1FBQ1QsTUFBTSxNQUFNLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsNkNBQTZDO1FBRTdDLE1BQU0sYUFBYSxHQUFHLElBQUksb0ZBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLGVBQWU7UUFDZixRQUFRO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdEIsVUFBVTtRQUNWLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQ3RELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQzFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDM0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUM7UUFDL0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM1QyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUc7Ozs7O1NBS2hDLENBQUM7UUFDRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFaEQsVUFBVTtRQUNWLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFOUMsWUFBWTtRQUNaLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFDNUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQzdELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUM5QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ2xELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLFVBQVU7UUFDaEYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO1FBQ3BELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQztRQUN6RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzlDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7YUFDN0M7WUFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDNUM7WUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDaEQ7WUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLGlCQUFpQixDQUFDO2FBQzFEO1lBQ0QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzthQUNsRDtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksd0NBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVILDBCQUEwQjtRQUMxQixtQ0FBbUM7UUFDbkMsTUFBTSxNQUFNLEdBQXlCLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUMsOEJBQThCO1lBQzlCLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFFekQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakosSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFL0wsMEJBQTBCO2dCQUMxQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUwsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNyQzthQUNKO2lCQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2FBQ3RDO1lBRUQsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNwQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUM1QyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRTFDLFlBQVk7UUFDWixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDM0MsVUFBVTtZQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTyxFQUFFO2dCQUM1QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDakIsT0FBTzthQUNWO1lBRUQsc0JBQXNCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtnQkFDeEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLGVBQWU7aUJBQzdEO2dCQUNELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLGNBQWM7aUJBQzNEO2dCQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLFdBQVc7aUJBQzVEO2dCQUNELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxlQUFlO2lCQUMxRTtnQkFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLG1CQUFtQjtvQkFDOUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2lCQUNsRDtnQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLHdDQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUM5RCxPQUFPO2FBQ1Y7WUFFRCwwQkFBMEI7WUFDMUIsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDcEMsUUFBUSxLQUFLLENBQUMsR0FBRyxFQUFFO29CQUNmLFFBQVE7b0JBQ1IsS0FBSyxXQUFXO3dCQUNaLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDckYsTUFBTTtvQkFDVixLQUFLLFlBQVk7d0JBQ2IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDcEYsTUFBTTtvQkFDVixLQUFLLFNBQVM7d0JBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNyRixNQUFNO29CQUNWLEtBQUssV0FBVzt3QkFDWixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNwRixNQUFNO29CQUVWLFlBQVk7b0JBQ1osS0FBSyxHQUFHO3dCQUNKLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdkIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFDOzRCQUNuRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWE7NEJBQ2hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ2xNO3dCQUNELE1BQU07b0JBRVYsYUFBYTtvQkFDYixLQUFLLE9BQU87d0JBQ1IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBQzs0QkFDekUsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7NEJBQzNCLGFBQWE7NEJBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7NEJBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs0QkFDOUMsWUFBWTs0QkFDWixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDOzRCQUMvQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDOzRCQUMvQixjQUFjOzRCQUNkLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzZCQUN0Qzs0QkFDRCxTQUFTOzRCQUNULFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0NBQ1osSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0NBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29DQUNoQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztpQ0FDcEM7NEJBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7eUJBQ2hDO3dCQUNELE1BQU07aUJBQ2I7YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCxnQkFBZ0I7SUFDUixXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx3Q0FBVyxFQUFFLENBQUM7UUFFL0IsV0FBVztRQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw0Q0FBWSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNELEtBQUs7UUFDTCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSw4Q0FBaUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sY0FBYyxHQUFHLElBQUksdURBQTBCLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0csTUFBTSxVQUFVLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNsRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUzQixNQUFNLFdBQVcsR0FBRyxJQUFJLDBDQUFVLENBQUMsSUFBSSwyQ0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFGLE1BQU0sVUFBVSxHQUFHLElBQUksMkNBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksMkNBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZGLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RixVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRS9CLFNBQVM7UUFDVCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksbURBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNCLGdCQUFnQjtRQUNoQixNQUFNLGFBQWEsR0FBRyxJQUFJLG9EQUF1QixDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLDZDQUFnQixFQUFFLENBQUMsQ0FBQztRQUNoSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksdUNBQVUsQ0FBQyxJQUFJLGlEQUFvQixFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFHLGVBQWU7UUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVuQyxZQUFZO1FBQ1osSUFBSSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7WUFDNUIsV0FBVztZQUNYLElBQUksUUFBUSxHQUFHLElBQUksaURBQW9CLEVBQUUsQ0FBQztZQUUxQyxJQUFJLGNBQWMsR0FBRyxHQUFHLEVBQUU7Z0JBQ3RCLGFBQWE7Z0JBQ2IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUVuQixnQkFBZ0I7Z0JBQ2hCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPO29CQUFFLE9BQU8sSUFBSSwwQ0FBYSxFQUFFLENBQUM7Z0JBQ3pDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDN0ksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRTFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUM3QixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELFdBQVc7Z0JBQ1gsTUFBTSxPQUFPLEdBQUcsSUFBSSwwQ0FBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztnQkFDM0IsT0FBTyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUFDO1lBRUYsV0FBVztZQUNYLElBQUksUUFBUSxHQUFHLElBQUksaURBQW9CLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxHQUFHO2dCQUNULEdBQUcsRUFBRSxjQUFjLEVBQUU7Z0JBQ3JCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixRQUFRLEVBQUUsbURBQXNCO2dCQUNoQyxLQUFLLEVBQUUsUUFBUTtnQkFDZixVQUFVLEVBQUUsS0FBSztnQkFDakIsT0FBTyxFQUFDLEdBQUc7YUFDZCxDQUFDLENBQUM7WUFFSCxjQUFjO1lBQ2QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztZQUUzQixxQkFBcUI7WUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFFeEQsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFL0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN2QyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksMENBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDN0Q7WUFDRCxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLGtEQUFxQixDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFFLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkseUNBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxvQkFBb0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCO1FBRTFDLGlCQUFpQjtRQUNqQixNQUFNLHVCQUF1QixHQUFHLElBQUksd0NBQVcsRUFBRSxDQUFDO1FBQ2xELE1BQU0seUJBQXlCLEdBQXlCLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDN0QsNkJBQTZCO1lBQzdCLElBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ25DLE1BQU0sU0FBUyxHQUFHLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUcsaUJBQWlCO2dCQUN6RSxVQUFVO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUV2QyxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3SCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRXRLLG9CQUFvQjtvQkFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO3dCQUNuRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxVQUFVLENB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LEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tICdjYW5ub24tZXMnO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG4gICAgcHJpdmF0ZSBjdWJlTWVzaGVzOiBUSFJFRS5NZXNoW10gPSBbXTtcbiAgICBwcml2YXRlIGN1YmVCb2RpZXM6IENBTk5PTi5Cb2R5W10gPSBbXTtcblxuICAgIC8vIOOCsuODvOODoOOBrueKtuaFi+euoeeQhlxuICAgIHByaXZhdGUgZ2FtZVN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTsgICAvLyDjgrLjg7zjg6DjgYzplovlp4vjgZXjgozjgZ/jgYtcbiAgICBwcml2YXRlIGdhbWVPdmVyOiBib29sZWFuID0gZmFsc2U7ICAvLyDjgrLjg7zjg6DjgYzntYLkuobjgZfjgZ/jgYtcblxuICAgIC8vIOOCueOCs+OCoumWouS/glxuICAgIHByaXZhdGUgbWF4U3RhY2tIZWlnaHQ6IG51bWJlciA9IDA7IC8vIOacgOmrmOepjeOBv+S4iuOBkumrmOOBlVxuICAgIHByaXZhdGUgZmFpbHVyZUNvdW50OiBudW1iZXIgPSAwOyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgYzokL3jgaHjgZ/lm57mlbBcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1heEZhaWx1cmVzOiBudW1iZXIgPSA1OyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zjgavjgarjgovlpLHmlZflm57mlbBcblxuICAgIC8vIOasoeOBq+iQveOBoeOBpuOBj+OCi+OCquODluOCuOOCp+OCr+ODiFxuICAgIHByaXZhdGUgdGFyZ2V0U3Bhd25YOiBudW1iZXIgPSAwOyAvLyDmrKHjgavnlJ/miJDjgZXjgozjgovjgqrjg5bjgrjjgqfjgq/jg4jjga7nm67mqJlY5bqn5qiZXG4gICAgcHJpdmF0ZSB0YXJnZXRTcGF3blo6IG51bWJlciA9IDA7IC8vIOasoeOBq+eUn+aIkOOBleOCjOOCi+OCquODluOCuOOCp+OCr+ODiOOBruebruaomVrluqfmqJlcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1vdmVTcGVlZDogbnVtYmVyID0gMC4yOyAvLyDjg5fjg6zjgqTjg6Tjg7zmk43kvZzjgavjgojjgovnp7vli5XpgJ/luqZcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1heE1vdmVSYW5nZTogbnVtYmVyID0gMTA7IC8vIOOCquODluOCuOOCp+OCr+ODiOOBruawtOW5s+enu+WLleOBruacgOWkp+evhOWbslxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3Bhd25ZUG9zaXRpb246IG51bWJlciA9IDEyOyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgYznlJ/miJDjgZXjgozjgotZ5bqn5qiZXG5cbiAgICAvLyDnj77lnKjmk43kvZzkuK3jga7jgqrjg5bjgrjjgqfjgq/jg4jjga7jg5fjg6zjg5Pjg6Xjg7xcbiAgICBwcml2YXRlIGN1cnJlbnRQcmV2aWV3TWVzaDogVEhSRUUuTWVzaDsgLy8g54++5Zyo44OX44Os44OT44Ol44O85Lit44GuVGhyZWUuanPjg6Hjg4Pjgrfjg6VcbiAgICBwcml2YXRlIGN1cnJlbnRQcmV2aWV3Qm9keTogQ0FOTk9OLkJvZHk7IC8vIOePvuWcqOODl+ODrOODk+ODpeODvOS4reOBrkNhbm5vbi5qc+ODnOODh+OCo1xuXG4gICAgLy8g6JC95LiLXG4gICAgcHJpdmF0ZSBjYW5Ecm9wT2JqZWN0OiBib29sZWFuID0gdHJ1ZTsgIC8vIOiQveS4i+OBleOBm+OCieOCjOOCi+OBi+OBqeOBhuOBi1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZHJvcENvb2xkb3duOiBudW1iZXIgPSAxLjsgLy8g44Kv44O844Or44OA44Km44Oz5pmC6ZaTXG5cbiAgICAvLyBVSeimgee0oFxuICAgIHByaXZhdGUgaW5mb0RpdjogSFRNTERpdkVsZW1lbnQ7ICAvLyDjgrLjg7zjg6Dmg4XloLHooajnpLrnlKjjga5IVE1M6KaB57SgXG4gICAgcHJpdmF0ZSBzdGFydEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7ICAgLy8g44Ky44O844Og44K544K/44O844OI44Oc44K/44Oz55So44GuSFRNTOimgee0oFxuICAgIHByaXZhdGUgcmVzdGFydEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7IC8vIOODquODiOODqeOCpOODnOOCv+ODs+eUqOOBrkhUTUzopoHntKBcbiAgICBwcml2YXRlIGluc3RydWN0aW9uc0RpdjogSFRNTERpdkVsZW1lbnQ7ICAvLyDmk43kvZzoqqzmmI7nlKjjga5IVE1M6KaB57SgXG4gICAgcHJpdmF0ZSBnYW1lT3ZlckRpc3BsYXlEaXY6IEhUTUxEaXZFbGVtZW50OyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7znlKjjga5IVE1M6KaB57SgXG5cbiAgICAvLyDokL3kuIvjgqzjgqTjg4lcbiAgICBwcml2YXRlIGRyb3BHdWlkZU1lc2g6IFRIUkVFLk1lc2g7IC8vIOiQveS4i+OCrOOCpOODieODoeODg+OCt+ODpVxuXG4gICAgLy8g44OR44O844OG44Kj44Kv44Or6Zai6YCjXG4gICAgcHJpdmF0ZSBjbG91ZDogVEhSRUUuUG9pbnRzOyAgIC8vIOODkeODvOODhuOCo+OCr+ODq+e+pOOBruODoeOCpOODs+OCquODluOCuOOCp+OCr+ODiFxuICAgIHByaXZhdGUgcGFydGljbGVWZWxvY2l0eTogVEhSRUUuVmVjdG9yM1tdID0gW107IC8vIOWQhOODkeODvOODhuOCo+OCr+ODq+OBrumAn+W6puOCkuS/neaMgeOBmeOCi+mFjeWIl1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFydGljbGVBcmVhU2l6ZTogbnVtYmVyID0gNDA7IC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOWIhuW4g+OBmeOCi+epuumWk+OBruOCteOCpOOCulxuICAgIFxuICAgIC8vIOODq+ODvOODl+WItuW+oUlEXG4gICAgcHJpdmF0ZSBwaHlzaWNzQW5kUGFydGljbGVGcmFtZUlkOiBudW1iZXI7IC8vIOeJqeeQhua8lOeul+OBqOODkeODvOODhuOCo+OCr+ODq+OBruODq+ODvOODl+OBrklEXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKVxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHgxYTFhMmUpKTsgLy8g5pqX44GE6Z2S57Sr44Gu44KI44GG44Gq6ImyXG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgIC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy8g44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg1MCwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIC8vY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAxMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgICAgICBvcmJpdENvbnRyb2xzLnRhcmdldC5zZXQoMCwgNiwgMCk7IFxuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcblxuICAgICAgICAvLyBVSeimgee0oOOBrueUn+aIkOOBqOWIneacn+ioreWumlxuICAgICAgICAvLyDjgrLjg7zjg6Dmg4XloLFcbiAgICAgICAgdGhpcy5pbmZvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS50b3AgPSAnMjBweCc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5sZWZ0ID0gJzIwcHgnO1xuICAgICAgICB0aGlzLmluZm9EaXYuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLmluZm9EaXYuc3R5bGUuZm9udFNpemUgPSAnMTZweCc7XG4gICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjUpJztcbiAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLnBhZGRpbmcgPSAnOHB4JztcbiAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaW5mb0Rpdik7XG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUluZm8oKTtcblxuICAgICAgICAvLyDjgrLjg7zjg6Djgrnjgr/jg7zjg4hcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnRleHRDb250ZW50ID0gJ+OCsuODvOODoOOCueOCv+ODvOODiCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLnRvcCA9ICcxMzBweCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUubGVmdCA9ICczNDBweCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnMTVweCAzMHB4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9ICcyNnB4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzRDQUY1MCc7XG4gICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnN3B4JztcbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5zdGFydEJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaTjeS9nOiqrOaYjlxuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLnRvcCA9ICcyMzBweCc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLmxlZnQgPSAnMTkzcHgnO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLmZvbnRTaXplID0gJzE1cHgnO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUucGFkZGluZyA9ICcxMHB4JztcbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zRGl2LnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8aDM+5pON5L2c5pa55rOVPC9oMz5cbiAgICAgICAgICAgIDxwPuKXgCDilrYg4payIOKWvCA6IOODluODreODg+OCr+OCkuawtOW5s+enu+WLlTwvcD5cbiAgICAgICAgICAgIDxwPuOCueODmuODvOOCueOCreODvCA6IOODluODreODg+OCr+OCkljou7jlkajjgorjgavlm57ou6I8L3A+XG4gICAgICAgICAgICA8cD5FbnRlcuOCreODvCA6IOODluODreODg+OCr+OCkuiQveS4izwvcD5cbiAgICAgICAgYDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmluc3RydWN0aW9uc0Rpdik7XG5cbiAgICAgICAgLy8g44Oq44OI44Op44Kk44Oc44K/44OzXG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24udGV4dENvbnRlbnQgPSAn44Oq44OI44Op44KkJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnRvcCA9ICczMDBweCc7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5sZWZ0ID0gJzM0MHB4JztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnMTBweCAyMHB4JztcbiAgICAgICAgdGhpcy5yZXN0YXJ0QnV0dG9uLnN0eWxlLmZvbnRTaXplID0gJzI2cHgnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmNDQzMzYnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gJzhweCc7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVzdGFydEJ1dHRvbik7XG5cbiAgICAgICAgLy8g44Ky44O844Og44Kq44O844OQ44O86KGo56S6XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUudG9wID0gJzEzMHB4JztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUubGVmdCA9ICczNDBweCc7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5mb250U2l6ZSA9ICczMHB4JztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZm9udFdlaWdodCA9ICdib2xkJztcbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknOyAvLyDljYrpgI/mmI7jga7pu5Log4zmma9cbiAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUucGFkZGluZyA9ICcyMHB4IDMwcHgnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTBweCc7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2LnN0eWxlLmJvcmRlciA9ICcycHggc29saWQgd2hpdGUnO1xuICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2KTtcblxuICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0R2FtZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydEJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zRGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbmZvRGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmZvRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsMCwwLDAuNSknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcigweDFhMWEyZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvLyDjg5fjg6zjgqTjg6Tjg7zjga7mk43kvZzjgavlkIjjgo/jgZvjgabjg5fjg6zjg5Pjg6Xjg7zjga7kvY3nva7jgajlm57ou6LjgpLmm7TmlrBcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnBvc2l0aW9uLnggPSB0aGlzLnRhcmdldFNwYXduWDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5wb3NpdGlvbi56ID0gdGhpcy50YXJnZXRTcGF3blo7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueSA9IHRoaXMuc3Bhd25ZUG9zaXRpb247XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keS5wb3NpdGlvbi5zZXQodGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueCwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueSwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0JvZHkucXVhdGVybmlvbi5zZXQodGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi54LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLnksIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueiwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi53KTtcblxuICAgICAgICAgICAgICAgIC8vIOiQveS4i+OCrOOCpOODieODoeODg+OCt+ODpeOBruihqOekuueKtuaFi+OBqOS9jee9ruODu+Wbnui7ouOBruabtOaWsFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnBvc2l0aW9uLnggPSB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5wb3NpdGlvbi54O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gucG9zaXRpb24ueiA9IHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnBvc2l0aW9uLno7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC5wb3NpdGlvbi55ID0gMC4wMDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC5xdWF0ZXJuaW9uLnNldCh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLngsIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueSwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi56LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG5cbiAgICAgICAgLy8g44Kt44O844Oc44O844OJ44Kk44OZ44Oz44OIXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIOOCsuODvOODoOOCueOCv+ODvOODiFxuICAgICAgICAgICAgaWYgKCF0aGlzLmdhbWVTdGFydGVkICYmIGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOOCsuODvOODoOOCquODvOODkOODvOaZguOBq0VudGVy44Gn44Oq44OI44Op44KkXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lT3ZlciAmJiBldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRHYW1lKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVzdGFydEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJzsgLy8g44Oq44OI44Op44Kk44Oc44K/44Oz44KS6Z2e6KGo56S644GrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IC8vIOOCueOCv+ODvOODiOODnOOCv+ODs+OCkuihqOekuuOBq1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnNEaXYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnNEaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IC8vIOaTjeS9nOiqrOaYjuOCkuihqOekuuOBq1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmZvRGl2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwLjUpJzsgLy8g5oOF5aCx44OR44ON44Or44Gu6Imy44KS5YWD44Gr5oi744GZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWVPdmVyRGlzcGxheURpdikgeyAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zooajnpLrjgpLpnZ7ooajnpLrjgavjgZnjgotcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckRpc3BsYXlEaXYuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKDB4MWExYTJlKTsgLy8g6IOM5pmv6Imy44KS5YWD44Gr5oi744GZXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDjgrLjg7zjg6DjgYzplovlp4vjgZXjgozjgabjgIHjgrLjg7zjg6Djgqrjg7zjg5Djg7zjgafjga/jgarjgYTjgajjgY1cbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWVTdGFydGVkICYmICF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55+i5Y2w44Gn56e75YuVXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6IFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25YID0gTWF0aC5tYXgoLXRoaXMubWF4TW92ZVJhbmdlLCB0aGlzLnRhcmdldFNwYXduWCAtIHRoaXMubW92ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzogXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRTcGF3blggPSBNYXRoLm1pbih0aGlzLm1heE1vdmVSYW5nZSwgdGhpcy50YXJnZXRTcGF3blggKyB0aGlzLm1vdmVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6IFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25aID0gTWF0aC5tYXgoLXRoaXMubWF4TW92ZVJhbmdlLCB0aGlzLnRhcmdldFNwYXduWiAtIHRoaXMubW92ZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0U3Bhd25aID0gTWF0aC5taW4odGhpcy5tYXhNb3ZlUmFuZ2UsIHRoaXMudGFyZ2V0U3Bhd25aICsgdGhpcy5tb3ZlU3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7ICAgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8g44K544Oa44O844K544Kt44O844Gn5Zue6LuiXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyAnOiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UHJldmlld01lc2ggJiYgdGhpcy5jdXJyZW50UHJldmlld0JvZHkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnJvdGF0aW9uLnggKz0gTWF0aC5QSSAvIDI7IC8vIFjou7jlkajjgorjgas5MOW6puWbnui7olxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdCb2R5LnF1YXRlcm5pb24uc2V0KHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24ueCwgdGhpcy5jdXJyZW50UHJldmlld01lc2gucXVhdGVybmlvbi55LCB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaC5xdWF0ZXJuaW9uLnosIHRoaXMuY3VycmVudFByZXZpZXdNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAvLyBFbnRlcuOCreODvOOBp+iQveS4i1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuRHJvcE9iamVjdCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCAmJiB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5Ecm9wT2JqZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44OX44Os44OT44Ol44O844GL44KJ54mp55CG44G4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHRoaXMuY3VycmVudFByZXZpZXdCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1YmVNZXNoZXMucHVzaCh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdWJlQm9kaWVzLnB1c2godGhpcy5jdXJyZW50UHJldmlld0JvZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOODl+ODrOODk+ODpeODvOOCkuOCr+ODquOColxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3Qm9keSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Ks44Kk44OJ44KS6Z2e6KGo56S6ICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3BHdWlkZU1lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Kv44O844Or44OA44Km44OzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuRHJvcE9iamVjdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5nYW1lT3Zlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGF3bk5leHRPYmplY3RGb3JQcmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLmRyb3BDb29sZG93biAqIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIC8vIOeJqeeQhua8lOeul+ODr+ODvOODq+ODiVxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7IGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCkgfSk7XG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuOTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wMTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uKTtcblxuICAgICAgICAvLyDlnLDpnaJcbiAgICAgICAgY29uc3QgZ3JvdW5kU2l6ZSA9IDQ7XG4gICAgICAgIGNvbnN0IGdyb3VuZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KGdyb3VuZFNpemUsIDAuNSwgZ3JvdW5kU2l6ZSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4YzdjNGJkLCByb3VnaG5lc3M6IDAuOCwgbWV0YWxuZXNzOiAwLjEgfSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZE1lc2ggPSBuZXcgVEhSRUUuTWVzaChncm91bmRHZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgICBncm91bmRNZXNoLnBvc2l0aW9uLnkgPSAtMC4yNTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JvdW5kTWVzaCk7XG5cbiAgICAgICAgY29uc3QgZ3JvdW5kU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoZ3JvdW5kU2l6ZSAvIDIsIDAuMjUsIGdyb3VuZFNpemUgLyAyKSk7XG4gICAgICAgIGNvbnN0IGdyb3VuZEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwLCBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKDAsIC0wLjI1LCAwKX0pO1xuICAgICAgICBncm91bmRCb2R5LmFkZFNoYXBlKGdyb3VuZFNoYXBlKTtcbiAgICAgICAgZ3JvdW5kQm9keS5wb3NpdGlvbi5zZXQoZ3JvdW5kTWVzaC5wb3NpdGlvbi54LCBncm91bmRNZXNoLnBvc2l0aW9uLnksIGdyb3VuZE1lc2gucG9zaXRpb24ueik7XG4gICAgICAgIGdyb3VuZEJvZHkucXVhdGVybmlvbi5zZXQoZ3JvdW5kTWVzaC5xdWF0ZXJuaW9uLngsIGdyb3VuZE1lc2gucXVhdGVybmlvbi55LCBncm91bmRNZXNoLnF1YXRlcm5pb24ueiwgZ3JvdW5kTWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoZ3JvdW5kQm9keSk7XG5cbiAgICAgICAgLy8g44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KDEwLCAyMCwgMTApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICAvLyDokL3kuIvjgqzjgqTjg4njg6Hjg4Pjgrfjg6Xjga7liJ3mnJ/ljJZcbiAgICAgICAgY29uc3QgZ3VpZGVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmYwMCwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuMiwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KTtcbiAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCksIGd1aWRlTWF0ZXJpYWwpO1xuICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gucG9zaXRpb24ueSA9IDAuMDE7ICAgLy8g5Zyw6Z2i44KI44KK44KP44Ga44GL44Gr5rWu44GL44Gb44KLXG4gICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuZHJvcEd1aWRlTWVzaCk7XG5cbiAgICAgICAgLy8g44OR44O844OG44Kj44Kv44Or44Gu55Sf5oiQXG4gICAgICAgIGxldCBjcmVhdGVQYXJ0aWNsZXNMb2NhbCA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIOOCuOOCquODoeODiOODquOBruS9nOaIkFxuICAgICAgICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG5cbiAgICAgICAgICAgIGxldCBnZW5lcmF0ZVNwcml0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvL+aWsOOBl+OBhOOCreODo+ODs+ODkOOCueOBruS9nOaIkFxuICAgICAgICAgICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSAxNjtcbiAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gMTY7XG5cbiAgICAgICAgICAgICAgICAvLyDlhoblvaLjga7jgrDjg6njg4fjg7zjgrfjg6fjg7Pjga7kvZzmiJBcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIGlmICghY29udGV4dCkgcmV0dXJuIG5ldyBUSFJFRS5UZXh0dXJlKCk7IFxuICAgICAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudChjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMiwgMCwgY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIsIGNhbnZhcy53aWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjIsICdyZ2JhKDAsMTkxLDI1NSwxKScpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjQsICdyZ2JhKDAsMCwxMjgsMSknKTtcbiAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMCwwLDAsMSknKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjga7nlJ/miJBcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoY2FudmFzKTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dHVyZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIOODnuODhuODquOCouODq+OBruS9nOaIkFxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50c01hdGVyaWFsKHsgXG4gICAgICAgICAgICAgICAgc2l6ZTogMS4wLCBcbiAgICAgICAgICAgICAgICBtYXA6IGdlbmVyYXRlU3ByaXRlKCksXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG4gICAgICAgICAgICAgICAgY29sb3I6IDB4RkZGRkZGLCBcbiAgICAgICAgICAgICAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OjAuOFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHBhcnRpY2xl44Gu5L2c5oiQXG4gICAgICAgICAgICBjb25zdCBwYXJ0aWNsZU51bSA9IDEwMDA7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KHBhcnRpY2xlTnVtICogMyk7XG4gICAgICAgICAgICBsZXQgcGFydGljbGVJbmRleCA9IDA7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlVmVsb2NpdHkgPSBbXTtcblxuICAgICAgICAgICAgLy8g5ZCE44OR44O844OG44Kj44Kv44Or44Gu5Yid5pyf5L2N572u44Go6YCf5bqm44KS6Kit5a6aXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlTnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wYXJ0aWNsZUFyZWFTaXplO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnBhcnRpY2xlQXJlYVNpemU7XG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMucGFydGljbGVBcmVhU2l6ZTtcblxuICAgICAgICAgICAgICAgIHBvc2l0aW9uc1twYXJ0aWNsZUluZGV4KytdID0geDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnNbcGFydGljbGVJbmRleCsrXSA9IHk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25zW3BhcnRpY2xlSW5kZXgrK10gPSB6O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdnggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjE7XG4gICAgICAgICAgICAgICAgY29uc3QgdnkgPSAtKDAuNSArIE1hdGgucmFuZG9tKCkgKiAwLjUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZ6ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4xO1xuICAgICAgICAgICAgICAgIHRoaXMucGFydGljbGVWZWxvY2l0eS5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKHZ4LCB2eSwgdnopKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBvc2l0aW9ucywzKSk7XG5cbiAgICAgICAgICAgIC8vIFRIUkVFLlBvaW50c+OBruS9nOaIkFxuICAgICAgICAgICAgdGhpcy5jbG91ZCA9IG5ldyBUSFJFRS5Qb2ludHMoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2xvdWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlUGFydGljbGVzTG9jYWwoKTsgLy8g44OR44O844OG44Kj44Kv44Or55Sf5oiQ6Zai5pWw44KS5ZG844Gz5Ye644GZXG5cbiAgICAgICAgLy8g54mp55CG5ryU566X44Go44OR44O844OG44Kj44Kv44Or44KS5pu05pawXG4gICAgICAgIGNvbnN0IHBoeXNpY3NBbmRQYXJ0aWNsZUNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgICAgIGNvbnN0IHVwZGF0ZVBoeXNpY3NBbmRQYXJ0aWNsZXM6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIC8vIOOCsuODvOODoOmWi+Wni+OBleOCjOOBpuOAgeOCsuODvOODoOOCquODvOODkOODvOOBp+OBr+OBquOBhOWgtOWQiOOBruOBv+abtOaWsFxuICAgICAgICAgICAgaWYodGhpcy5nYW1lU3RhcnRlZCAmJiAhdGhpcy5nYW1lT3Zlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhVGltZSA9IHBoeXNpY3NBbmRQYXJ0aWNsZUNsb2NrLmdldERlbHRhKCk7ICAgLy8g5YmN5Zue44Gu54mp55CG5pu05paw44GL44KJ44Gu57WM6YGO5pmC6ZaTXG4gICAgICAgICAgICAgICAgLy8g54mp55CG5ryU566X44Gu5pu05pawXG4gICAgICAgICAgICAgICAgdGhpcy53b3JsZC5zdGVwKDEgLyA2MCwgZGVsdGFUaW1lLCAxMCk7XG5cbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jdWJlTWVzaGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ViZU1lc2hlc1tpXS5wb3NpdGlvbi5zZXQodGhpcy5jdWJlQm9kaWVzW2ldLnBvc2l0aW9uLngsIHRoaXMuY3ViZUJvZGllc1tpXS5wb3NpdGlvbi55LCB0aGlzLmN1YmVCb2RpZXNbaV0ucG9zaXRpb24ueik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ViZU1lc2hlc1tpXS5xdWF0ZXJuaW9uLnNldCh0aGlzLmN1YmVCb2RpZXNbaV0ucXVhdGVybmlvbi54LCB0aGlzLmN1YmVCb2RpZXNbaV0ucXVhdGVybmlvbi55LCB0aGlzLmN1YmVCb2RpZXNbaV0ucXVhdGVybmlvbi56LCB0aGlzLmN1YmVCb2RpZXNbaV0ucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44GM5Zyw6Z2i44Gu5LiL44Gr6JC944Gh44Gf5aC05ZCIXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1YmVCb2RpZXNbaV0ucG9zaXRpb24ueSA8IC01ICYmIHRoaXMuY3ViZUJvZGllc1tpXS5tYXNzID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mYWlsdXJlQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud29ybGQucmVtb3ZlQm9keSh0aGlzLmN1YmVCb2RpZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5jdWJlTWVzaGVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3ViZUJvZGllcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1YmVNZXNoZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHYW1lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gNeWAi+iQveOBoeOBn+OCiVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZmFpbHVyZUNvdW50ID49IHRoaXMubWF4RmFpbHVyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BHYW1lTG9naWMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDjg5Hjg7zjg4bjgqPjgq/jg6vjga7kvY3nva7mm7TmlrBcbiAgICAgICAgICAgICAgICBjb25zdCBnZW9tID0gPFRIUkVFLkJ1ZmZlckdlb21ldHJ5PnRoaXMuY2xvdWQuZ2VvbWV0cnk7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gZ2VvbS5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJyk7IFxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuY291bnQ7IGkrKykgeyBcbiAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBwb3NpdGlvbnMuZ2V0WChpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSBwb3NpdGlvbnMuZ2V0WShpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHogPSBwb3NpdGlvbnMuZ2V0WihpKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMucGFydGljbGVWZWxvY2l0eVtpXTtcblxuICAgICAgICAgICAgICAgICAgICB4ICs9IHZlbG9jaXR5LnggKiBkZWx0YVRpbWU7XG4gICAgICAgICAgICAgICAgICAgIHkgKz0gdmVsb2NpdHkueSAqIGRlbHRhVGltZTtcbiAgICAgICAgICAgICAgICAgICAgeiArPSB2ZWxvY2l0eS56ICogZGVsdGFUaW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOODkeODvOODhuOCo+OCr+ODq+OBjOeUu+mdouS4i+err+OCkui2heOBiOOBn+OCieS4iuOBq+aIu+OBmVxuICAgICAgICAgICAgICAgICAgICBpZiAoeSA8IC10aGlzLnBhcnRpY2xlQXJlYVNpemUgLyAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gdGhpcy5wYXJ0aWNsZUFyZWFTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLnBhcnRpY2xlQXJlYVNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB6ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5wYXJ0aWNsZUFyZWFTaXplO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zZXRYKGksIHgpO1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnMuc2V0WShpLCB5KTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnNldFooaSwgeik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdhbWVJbmZvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUGh5c2ljc0FuZFBhcnRpY2xlcyk7IFxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQaHlzaWNzQW5kUGFydGljbGVzKTsgXG4gICAgfVxuXG4gICAgLy8g44Ky44O844Og6ZaL5aeL5pmC44Gr5ZG844Gz5Ye644GZ44Oh44K944OD44OJXG4gICAgcHJpdmF0ZSBzdGFydEdhbWUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ZWQgPSB0cnVlOyAgICAvLyDjgrLjg7zjg6Dplovlp4tcbiAgICAgICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZhaWx1cmVDb3VudCA9IDA7ICAvLyDlpLHmlZflm57mlbDjgpLjg6rjgrvjg4Pjg4hcbiAgICAgICAgdGhpcy5tYXhTdGFja0hlaWdodCA9IDA7ICAgIC8vIOacgOmrmOmrmOOBleOCkuODquOCu+ODg+ODiFxuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVJbmZvKCk7ICAvLyBVSeaDheWgseOCkuabtOaWsFxuICAgICAgICB0aGlzLnNwYXduTmV4dE9iamVjdEZvclByZXZpZXcoKTsgICAvLyDmnIDliJ3jga7jg5bjg63jg4Pjgq/jgpLjg5fjg6zjg5Pjg6Xjg7zooajnpLpcblxuICAgICAgICAvLyBVSeimgee0oOOBruihqOekui/pnZ7ooajnpLrjga7liIfjgormm7/jgYhcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRCdXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJzsgLy8g44K544K/44O844OI44Oc44K/44Oz44KS6Z2e6KGo56S6XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmluc3RydWN0aW9uc0Rpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyAvLyDmk43kvZzoqqzmmI7jgpLpnZ7ooajnpLpcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHgxYTFhMmUpOyAvLyDog4zmma/oibLjgpLliJ3mnJ/nirbmhYvjgavmiLvjgZlcbiAgICB9XG5cbiAgICAvLyDjgrLjg7zjg6DnirbmhYvjgpLjg6rjgrvjg4Pjg4jjgZfjgIHliJ3mnJ/nirbmhYvjgavmiLvjgZnjg6Hjgr3jg4Pjg4lcbiAgICBwcml2YXRlIHJlc2V0R2FtZSA9ICgpID0+IHtcbiAgICAgICAgLy8g44K344O844Oz44Go54mp55CG44Ov44O844Or44OJ44GL44KJ5pei5a2Y44Gu44OW44Ot44OD44Kv44KS44GZ44G544Gm5YmK6ZmkXG4gICAgICAgIHRoaXMuY3ViZU1lc2hlcy5mb3JFYWNoKG1lc2ggPT4gdGhpcy5zY2VuZS5yZW1vdmUobWVzaCkpO1xuICAgICAgICB0aGlzLmN1YmVCb2RpZXMuZm9yRWFjaChib2R5ID0+IHRoaXMud29ybGQucmVtb3ZlQm9keShib2R5KSk7XG4gICAgICAgIHRoaXMuY3ViZU1lc2hlcyA9IFtdOyAvLyDphY3liJfjgpLjgq/jg6rjgqJcbiAgICAgICAgdGhpcy5jdWJlQm9kaWVzID0gW107IC8vIOmFjeWIl+OCkuOCr+ODquOColxuXG4gICAgICAgIC8vIOOCsuODvOODoOeKtuaFi+ODleODqeOCsOOCkuODquOCu+ODg+ODiFxuICAgICAgICB0aGlzLmdhbWVTdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXhTdGFja0hlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuZmFpbHVyZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy50YXJnZXRTcGF3blggPSAwO1xuICAgICAgICB0aGlzLnRhcmdldFNwYXduWiA9IDA7XG4gICAgICAgIHRoaXMuY2FuRHJvcE9iamVjdCA9IHRydWU7XG5cbiAgICAgICAgLy8g44OX44Os44OT44Ol44O844Kq44OW44K444Kn44Kv44OI44Go6JC95LiL44Ks44Kk44OJ44KS5YmK6ZmkL+mdnuihqOekulxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UHJldmlld01lc2gpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuY3VycmVudFByZXZpZXdNZXNoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdNZXNoID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdCb2R5ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcm9wR3VpZGVNZXNoKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlR2FtZUluZm8oKTsgLy8gVUnmg4XloLHjgpLmm7TmlrBcblxuICAgICAgICAvLyDjg6rjgrvjg4Pjg4jmmYLjgavniannkIbmvJTnrpfjgajjg5Hjg7zjg4bjgqPjgq/jg6vmm7TmlrDjg6vjg7zjg5fjgpLlgZzmraJcbiAgICAgICAgaWYgKHRoaXMucGh5c2ljc0FuZFBhcnRpY2xlRnJhbWVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5waHlzaWNzQW5kUGFydGljbGVGcmFtZUlkKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc0FuZFBhcnRpY2xlRnJhbWVJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDmrKHjgavokL3kuIvjgZXjgZvjgovjgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJDjgajjg5fjg6zjg5Pjg6Xjg7zooajnpLrjgZnjgovjg6Hjgr3jg4Pjg4lcbiAgICBwcml2YXRlIHNwYXduTmV4dE9iamVjdEZvclByZXZpZXcgPSAoKSA9PiB7XG4gICAgICAgIC8vIOOCquODluOCuOOCp+OCr+ODiOOBruODqeODs+ODgOODoOOBquOCteOCpOOCuuOCkuaxuuWumlxuICAgICAgICBjb25zdCBtaW5TaXplID0gMC41OyAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjga7mnIDlsI/jgrXjgqTjgrpcbiAgICAgICAgY29uc3QgbWF4U2l6ZSA9IDEuMDsgLy8g44Kq44OW44K444Kn44Kv44OI44Gu5pyA5aSn44K144Kk44K6XG4gICAgICAgIGNvbnN0IHJhbmRvbVNpemUgPSBtaW5TaXplICsgKE1hdGgucmFuZG9tKCkgKiAobWF4U2l6ZSAtIG1pblNpemUpKTsgXG5cbiAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Gu5b2i54q244K/44Kk44OX44KS5a6a576pXG4gICAgICAgIGNvbnN0IGdlb21ldHJpZXMgPSBbXG4gICAgICAgICAgICAvLyDmqJnmupbnmoTjgarnq4vmlrnkvZNcbiAgICAgICAgICAgIHsgZ2VvOiBuZXcgVEhSRUUuQm94R2VvbWV0cnkocmFuZG9tU2l6ZSwgcmFuZG9tU2l6ZSwgcmFuZG9tU2l6ZSksIGNhbm5vblNoYXBlOiBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMocmFuZG9tU2l6ZSAvIDIsIHJhbmRvbVNpemUgLyAyLCByYW5kb21TaXplIC8gMikpIH0sXG4gICAgICAgICAgICAvLyDluYXluoPjga7lubPjgZ/jgYTnm7TmlrnkvZMgKOadv+eKtilcbiAgICAgICAgICAgIHsgZ2VvOiBuZXcgVEhSRUUuQm94R2VvbWV0cnkocmFuZG9tU2l6ZSAqIDIuMCwgcmFuZG9tU2l6ZSAqIDAuNSwgcmFuZG9tU2l6ZSAqIDEuNSksIGNhbm5vblNoYXBlOiBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMocmFuZG9tU2l6ZSAqIDEuMCwgcmFuZG9tU2l6ZSAqIDAuMjUsIHJhbmRvbVNpemUgKiAwLjc1KSkgfSxcbiAgICAgICAgICAgIC8vIOe0sOmVt+OBhOebtOaWueS9kyAo5qOS54q2KVxuICAgICAgICAgICAgeyBnZW86IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShyYW5kb21TaXplICogMC41LCByYW5kb21TaXplICogMi41LCByYW5kb21TaXplICogMC41KSwgY2Fubm9uU2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhyYW5kb21TaXplICogMC4yNSwgcmFuZG9tU2l6ZSAqIDEuMjUsIHJhbmRvbVNpemUgKiAwLjI1KSkgfSxcbiAgICAgICAgICAgIC8vIOWwkeOBl+Wkp+OBjeOCgeOBrueri+aWueS9k1xuICAgICAgICAgICAgeyBnZW86IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShyYW5kb21TaXplICogMS4yLCByYW5kb21TaXplICogMS4yLCByYW5kb21TaXplICogMS4yKSwgY2Fubm9uU2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMyhyYW5kb21TaXplICogMC42LCByYW5kb21TaXplICogMC42LCByYW5kb21TaXplICogMC42KSkgfSxcbiAgICAgICAgICAgIC8vIOato+WNgeS6jOmdouS9k1xuICAgICAgICAgICAgeyBnZW86IG5ldyBUSFJFRS5Eb2RlY2FoZWRyb25HZW9tZXRyeSAocmFuZG9tU2l6ZSAqIDAuNywgMCksIGNhbm5vblNoYXBlOiBuZXcgQ0FOTk9OLlNwaGVyZShyYW5kb21TaXplICogMC43KSB9XG4gICAgICAgIF07XG5cbiAgICAgICAgbGV0IHNlbGVjdGVkVHlwZTtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjEpIHsgLy8gMTAl44Gu56K6546H44Gn5aSa6Z2i5L2T44KS6YG45oqeXG4gICAgICAgICAgICBzZWxlY3RlZFR5cGUgPSBnZW9tZXRyaWVzWzRdOyAvLyDlpJrpnaLkvZNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOaui+OCiuOBrjkwJeOBr+eri+aWueS9k+ODu+ebtOaWueS9k+OBruS4reOBi+OCieODqeODs+ODgOODoOOBq+mBuOaKnlxuICAgICAgICAgICAgc2VsZWN0ZWRUeXBlID0gZ2VvbWV0cmllc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoZ2VvbWV0cmllcy5sZW5ndGggLSAxKSldO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gc2VsZWN0ZWRUeXBlLmdlbztcbiAgICAgICAgY29uc3QgY2Fubm9uU2hhcGUgPSBzZWxlY3RlZFR5cGUuY2Fubm9uU2hhcGU7XG5cbiAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44Gu6Imy44KS44Op44Oz44OA44Og44Gr6YG45oqeXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IFtcbiAgICAgICAgICAgIDB4MDBGRkZGLCAvLyDjgrfjgqLjg7MgKOaYjuOCi+OBhOawtOiJsilcbiAgICAgICAgICAgIDB4RkZGRjAwLCAvLyDjgqTjgqjjg63jg7wgKOaYjuOCi+OBhOm7hOiJsilcbiAgICAgICAgICAgIDB4RkYwMEZGLCAvLyDjg57jgrzjg7Pjgr8gKOaYjuOCi+OBhOe0q+ODlOODs+OCrylcbiAgICAgICAgICAgIDB4MDBGRjAwLCAvLyDprq7jgoTjgYvjgarnt5FcbiAgICAgICAgICAgIDB4RkY2NjAwLCAvLyDprq7jgoTjgYvjgarjgqrjg6zjg7PjgrhcbiAgICAgICAgICAgIDB4RkYzM0ZGICAvLyDjg5vjg4Pjg4jjg5Tjg7Pjgq9cbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcmFuZG9tQ29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoY29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbG9ycy5sZW5ndGgpXSk7XG4gICAgICAgIC8vIOOCquODluOCuOOCp+OCr+ODiOOBruODnuODhuODquOCouODq1xuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiByYW5kb21Db2xvciwgcm91Z2huZXNzOiAwLjUsIG1ldGFsbmVzczogMC4yIH0pO1xuXG4gICAgICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICBtZXNoLnBvc2l0aW9uLnNldCh0aGlzLnRhcmdldFNwYXduWCwgdGhpcy5zcGF3bllQb3NpdGlvbiwgdGhpcy50YXJnZXRTcGF3blopOyBcbiAgICAgICAgbWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobWVzaCk7XG5cbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgICAgICBtYXNzOiAxLCBcbiAgICAgICAgICAgIHNoYXBlOiBjYW5ub25TaGFwZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ0FOTk9OLlZlYzMobWVzaC5wb3NpdGlvbi54LCBtZXNoLnBvc2l0aW9uLnksIG1lc2gucG9zaXRpb24ueiksXG4gICAgICAgICAgICB2ZWxvY2l0eTogbmV3IENBTk5PTi5WZWMzKDAsIDAuMSwgMClcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCA9IG1lc2g7XG4gICAgICAgIHRoaXMuY3VycmVudFByZXZpZXdCb2R5ID0gYm9keTtcblxuICAgICAgICAvLyDokL3kuIvjgqzjgqTjg4njga7mm7TmlrBcbiAgICAgICAgaWYgKHRoaXMuZHJvcEd1aWRlTWVzaCkge1xuICAgICAgICAgICAgdGhpcy5kcm9wR3VpZGVNZXNoLmdlb21ldHJ5ID0gZ2VvbWV0cnkuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcEd1aWRlTWVzaC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOOCsuODvOODoOaDheWgseOCkuabtOaWsOOBl+OBpuOAgeihqOekuuOBmeOCi+ODoeOCveODg+ODiVxuICAgIHByaXZhdGUgdXBkYXRlR2FtZUluZm8gPSAoKSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50TWF4SGVpZ2h0ID0gMDtcbiAgICAgICAgLy8g54++5Zyo44Gu44OW44Ot44OD44Kv44Gu5Lit44Gn5pyA44KC6auY44GEWeW6p+aomeOCkuimi+OBpOOBkeOCi1xuICAgICAgICB0aGlzLmN1YmVNZXNoZXMuZm9yRWFjaChtZXNoID0+IHtcbiAgICAgICAgICAgIGlmIChtZXNoLnBvc2l0aW9uLnkgPiBjdXJyZW50TWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudE1heEhlaWdodCA9IG1lc2gucG9zaXRpb24ueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIOacgOmrmOepjeOBv+S4iuOBkumrmOOBleOCkuioiOeul1xuICAgICAgICB0aGlzLm1heFN0YWNrSGVpZ2h0ID0gTWF0aC5tYXgoMCwgY3VycmVudE1heEhlaWdodCAtIDAuNSk7IFxuICAgICAgICAvLyDmg4XloLHjga7mm7TmlrBcbiAgICAgICAgaWYgKHRoaXMuaW5mb0Rpdikge1xuICAgICAgICAgICAgdGhpcy5pbmZvRGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICBGYWlsdXJlczogJHt0aGlzLmZhaWx1cmVDb3VudH0gLyAke3RoaXMubWF4RmFpbHVyZXN9PGJyPlxuICAgICAgICAgICAgICAgIEhlaWdodDogJHt0aGlzLm1heFN0YWNrSGVpZ2h0LnRvRml4ZWQoMil9bVxuICAgICAgICAgICAgYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOOCsuODvOODoOOCkue1guS6huOBmeOCi+ODoeOCveODg+ODiVxuICAgIHByaXZhdGUgc3RvcEdhbWVMb2dpYyA9ICgpID0+IHtcbiAgICAgICAgLy8g5YuV44GN44KS5q2i44KB44KLXG4gICAgICAgIHRoaXMuY3ViZUJvZGllcy5mb3JFYWNoKGJvZHkgPT4ge1xuICAgICAgICAgICAgYm9keS5tYXNzID0gMDtcbiAgICAgICAgICAgIGJvZHkudmVsb2NpdHkuc2V0KDAsMCwwKTtcbiAgICAgICAgICAgIGJvZHkuYW5ndWxhclZlbG9jaXR5LnNldCgwLDAsMCk7XG4gICAgICAgICAgICBib2R5LmFsbG93U2xlZXAgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8g44OX44Os44OT44Ol44O8XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQcmV2aWV3TWVzaCkge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5jdXJyZW50UHJldmlld01lc2gpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld01lc2ggPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0JvZHkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIOiQveS4i+OCrOOCpOODieOCkumdnuihqOekulxuICAgICAgICBpZiAodGhpcy5kcm9wR3VpZGVNZXNoKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3BHdWlkZU1lc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOODquODiOODqeOCpOODnOOCv+ODs+OCkuihqOekuuOBmeOCi1xuICAgICAgICBpZiAodGhpcy5yZXN0YXJ0QnV0dG9uKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RhcnRCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5oOF5aCx44OR44ON44Or44Gu6IOM5pmv6Imy44Gu44G/5aSJ5pu0XG4gICAgICAgIGlmICh0aGlzLmluZm9EaXYpIHtcbiAgICAgICAgICAgIHRoaXMuaW5mb0Rpdi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsMCwwLDAuNyknO1xuICAgICAgICB9XG4gICAgICAgIC8vIOOCt+ODvOODs+OBruiDjOaZr+iJsuOCkui1pOOBj+OBmeOCi1xuICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHg4QjAwMDApO1xuICAgICAgICAvLyDjgrLjg7zjg6Djgqrjg7zjg5Djg7zjgpLooajnpLpcbiAgICAgICAgaWYgKHRoaXMuZ2FtZU92ZXJEaXNwbGF5RGl2KSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgR0FNRSBPVkVSITxicj5cbiAgICAgICAgICAgICAgICDmnIDlvozjga7pq5jjgZU6ICR7dGhpcy5tYXhTdGFja0hlaWdodC50b0ZpeGVkKDIpfW1cbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyRGlzcGxheURpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xuXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAxNSwgMTUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lc19qcy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYi1lNThiZDJcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=