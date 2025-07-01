import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './VirtualTour.css';

// 번역 데이터
const TRANSLATIONS = {
  "ko-KR": {
    "title": "한국청소년정책연구원",
    "subtitle": "🧠 연구원을 만나보세요",
    "moveInstruction": "WASD로 이동",
    "lookInstruction": "화살표 키 또는 마우스로 좌우 둘러보기",
    "interactInstruction": "E키로 상호작용",
    "danceInstruction": "스페이스바로 춤추기",
    "closeInstruction": "ESC로 대화 닫기/마우스 해제",
    "tipInstruction": "💡 대화 중 직접 질문을 입력할 수 있어요!",
    "customQuestionDivider": "━━━ 또는 직접 질문하기 ━━━",
    "customQuestionPlaceholder": "궁금한 점을 물어보세요! 예: '청소년 정책의 미래는?' 또는 '가장 보람있었던 프로젝트는?'",
    "askQuestionButton": "질문하기",
    "pressEToTalk": "E를 눌러 대화하기",
    "pressEToTalkTo": "E를 눌러 대화:",
    "youLabel": "나:",
    "danceEmoji": "💃🕺",
    "musicEmoji": "🎵",
    "ideaEmoji": "💡",
    "oofText": "아야!",
    "bonkText": "쿵!",
    
    // 질문들
    "roleQuestion": "청소년정책연구원에서 어떤 일을 하시나요?",
    "typicalDayQuestion": "평소 하루 일과는 어떻게 되나요?",
    "challengingPartQuestion": "가장 어려운 부분은 무엇인가요?",
    "rewardingMomentQuestion": "가장 보람있었던 순간은 언제였나요?",
    "youthPolicyQuestion": "청소년 정책의 중요성은 무엇인가요?",
    "currentProjectQuestion": "현재 진행 중인 프로젝트는 무엇인가요?",
    "researchMethodQuestion": "어떤 연구 방법을 주로 사용하시나요?",
    "policyImpactQuestion": "정책이 실제로 어떤 영향을 미치나요?",
    "youthVoiceQuestion": "청소년의 목소리를 어떻게 반영하시나요?",
    "futureVisionQuestion": "청소년 정책의 미래는 어떻게 보시나요?",
    "collaborationQuestion": "다른 기관과 어떻게 협력하시나요?",
    "dataAnalysisQuestion": "데이터 분석은 어떻게 활용하시나요?",
    "policyDevelopmentQuestion": "정책은 어떤 과정으로 만들어지나요?",
    "evaluationMethodQuestion": "정책 효과는 어떻게 평가하나요?",
    "internationalComparisonQuestion": "해외 청소년 정책과 어떻게 다른가요?",
    "technologyRoleQuestion": "기술이 청소년 정책에 미치는 영향은?",
    "mentalHealthQuestion": "청소년 정신건강 정책은 어떻게 발전하고 있나요?",
    "educationPolicyQuestion": "교육 정책과 어떻게 연계되나요?",
    "youthParticipationQuestion": "청소년 참여를 어떻게 촉진하시나요?",
    "evidenceBasedQuestion": "증거 기반 정책이란 무엇인가요?"
  },
  "en-US": {
    "title": "Korea Youth Policy Institute",
    "subtitle": "🧠 Meet the Researchers",
    "moveInstruction": "Use WASD to move around",
    "lookInstruction": "Arrow keys or mouse to look left/right",
    "interactInstruction": "Press E to interact",
    "danceInstruction": "Press SPACE to dance",
    "closeInstruction": "Press ESC to close dialogs/release mouse",
    "tipInstruction": "💡 Type custom questions when talking!",
    "customQuestionDivider": "━━━ Or ask your own question ━━━",
    "customQuestionPlaceholder": "Ask anything! e.g., 'What's the future of youth policy?' or 'Most rewarding project?'",
    "askQuestionButton": "Ask Question",
    "pressEToTalk": "Press E to talk",
    "pressEToTalkTo": "Press E to talk to",
    "youLabel": "You:",
    "danceEmoji": "💃🕺",
    "musicEmoji": "🎵",
    "ideaEmoji": "💡",
    "oofText": "Oof!",
    "bonkText": "Bonk!",
    
    // Questions
    "roleQuestion": "What's your role at the Youth Policy Institute?",
    "typicalDayQuestion": "What's a typical day like for you?",
    "challengingPartQuestion": "What's the most challenging part?",
    "rewardingMomentQuestion": "What was your most rewarding moment?",
    "youthPolicyQuestion": "Why is youth policy important?",
    "currentProjectQuestion": "What projects are you working on?",
    "researchMethodQuestion": "What research methods do you use?",
    "policyImpactQuestion": "How do policies impact youth?",
    "youthVoiceQuestion": "How do you incorporate youth voices?",
    "futureVisionQuestion": "What's the future of youth policy?",
    "collaborationQuestion": "How do you collaborate with others?",
    "dataAnalysisQuestion": "How do you use data analysis?",
    "policyDevelopmentQuestion": "How are policies developed?",
    "evaluationMethodQuestion": "How do you evaluate policy effectiveness?",
    "internationalComparisonQuestion": "How does Korea compare internationally?",
    "technologyRoleQuestion": "What role does technology play?",
    "mentalHealthQuestion": "How is mental health policy evolving?",
    "educationPolicyQuestion": "How does this connect to education?",
    "youthParticipationQuestion": "How do you promote youth participation?",
    "evidenceBasedQuestion": "What is evidence-based policy?"
  }
};

const VirtualTour: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [locale] = useState('ko-KR');
  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;
  
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<any>(null);
  const [dialogueContent, setDialogueContent] = useState('');
  const [dialogueOptions, setDialogueOptions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [nearbyCharacter, setNearbyCharacter] = useState<any>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<any>(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isGeminiEnabled, setIsGeminiEnabled] = useState(false);
  const nearbyCharacterRef = useRef<any>(null);
  const hoveredCharacterRef = useRef<any>(null);
  
  // Player state
  const playerRef = useRef({
    position: new THREE.Vector3(0, 1.6, 5),
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0.1,
    isDancing: false
  });
  
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseVectorRef = useRef(new THREE.Vector2());
  const charactersRef = useRef<THREE.Group[]>([]);
  
  useEffect(() => {
    // Check if Gemini API is configured
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setIsGeminiEnabled(geminiKey && geminiKey !== 'your_gemini_api_key_here');
    
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    scene.fog = new THREE.Fog(0xf5f5f5, 10, 50);
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 5);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xdcdcdc,
      roughness: 0.7,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Add floor tiles
    const tileGeometry = new THREE.PlaneGeometry(2, 2);
    const tileMaterial1 = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 });
    const tileMaterial2 = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
    
    for (let x = -20; x < 20; x += 2) {
      for (let z = -20; z < 20; z += 2) {
        const tile = new THREE.Mesh(
          tileGeometry, 
          ((x + z) / 2) % 2 === 0 ? tileMaterial1 : tileMaterial2
        );
        tile.position.set(x + 1, 0.01, z + 1);
        tile.rotation.x = -Math.PI / 2;
        tile.receiveShadow = true;
        scene.add(tile);
      }
    }
    
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf8f8f8,
      roughness: 0.9
    });
    
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.5
    });
    
    // Back wall with windows
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      wallMaterial
    );
    backWall.position.set(0, 5, -20);
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // Add windows
    for (let x = -15; x <= 15; x += 10) {
      const window = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 3),
        windowMaterial
      );
      window.position.set(x, 5, -19.9);
      scene.add(window);
    }
    
    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      wallMaterial
    );
    leftWall.position.set(-20, 5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 10),
      wallMaterial
    );
    rightWall.position.set(20, 5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // Office furniture
    const woodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b6914,
      roughness: 0.6,
      metalness: 0.1
    });
    
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      roughness: 0.3,
      metalness: 0.8
    });
    
    // Create desk function
    function createDesk(x: number, z: number) {
      const deskGroup = new THREE.Group();
      
      // Desk top
      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.1, 1.5),
        woodMaterial
      );
      deskTop.position.y = 0.75;
      deskTop.castShadow = true;
      deskTop.receiveShadow = true;
      deskGroup.add(deskTop);
      
      // Desk legs
      const legGeometry = new THREE.BoxGeometry(0.05, 0.7, 0.05);
      const legPositions = [
        [-1.45, 0.35, -0.7],
        [1.45, 0.35, -0.7],
        [-1.45, 0.35, 0.7],
        [1.45, 0.35, 0.7]
      ];
      
      legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, metalMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        deskGroup.add(leg);
      });
      
      // Computer monitor
      const monitorBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16),
        metalMaterial
      );
      monitorBase.position.set(0, 0.82, 0);
      deskGroup.add(monitorBase);
      
      const monitorStand = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.3, 0.05),
        metalMaterial
      );
      monitorStand.position.set(0, 0.95, 0);
      deskGroup.add(monitorStand);
      
      const monitorScreen = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.7, 0.05),
        new THREE.MeshStandardMaterial({ 
          color: 0x000000, 
          roughness: 0.1, 
          metalness: 0.5 
        })
      );
      monitorScreen.position.set(0, 1.3, 0);
      deskGroup.add(monitorScreen);
      
      // Chair
      const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.05, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      chairSeat.position.set(0, 0.5, 0.8);
      deskGroup.add(chairSeat);
      
      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.6, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      chairBack.position.set(0, 0.8, 1.02);
      deskGroup.add(chairBack);
      
      deskGroup.position.set(x, 0, z);
      return deskGroup;
    }
    
    // Add desks
    const desks = [
      createDesk(-10, -10),
      createDesk(0, -10),
      createDesk(10, -10),
      createDesk(-10, 5),
      createDesk(0, 5),
      createDesk(10, 5)
    ];
    desks.forEach(desk => scene.add(desk));
    
    // Characters data
    const charactersData = [
      {
        name: '김미래',
        role: '홍보담당관',
        position: [-10, 0, -5],
        shirtColor: 0x4169e1,
        hairColor: 0x3d3d3d,
        personality: '친절하고 열정적인',
        quirk: '청소년들의 이야기를 들을 때 가장 행복해합니다'
      },
      {
        name: '박서진',
        role: '안내데스크 매니저',
        position: [10, 0, -5],
        shirtColor: 0x9370db,
        hairColor: 0x4b0082,
        personality: '체계적이고 배려심 깊은',
        quirk: '모든 방문객의 이름을 기억하려고 노력합니다'
      },
      {
        name: '이연구',
        role: '선임연구위원',
        position: [-10, 0, 5],
        shirtColor: 0x228b22,
        hairColor: 0x8b4513,
        personality: '분석적이고 통찰력 있는',
        quirk: '데이터에서 이야기를 찾아내는 것을 좋아합니다'
      },
      {
        name: '최정책',
        role: '정책개발팀장',
        position: [10, 0, 5],
        shirtColor: 0xffa500,
        hairColor: 0x8b4513,
        personality: '혁신적이고 실용적인',
        quirk: '청소년의 목소리를 정책에 담는 것이 사명입니다'
      },
      {
        name: '강교육',
        role: '교육프로그램 코디네이터',
        position: [-5, 0, 0],
        shirtColor: 0xff6347,
        hairColor: 0xd2691e,
        personality: '창의적이고 격려하는',
        quirk: '새로운 교육 방법을 항상 연구합니다'
      },
      {
        name: '신상담',
        role: '청소년상담 전문가',
        position: [5, 0, 0],
        shirtColor: 0x20b2aa,
        hairColor: 0x2f4f4f,
        personality: '공감적이고 따뜻한',
        quirk: '청소년의 마음을 이해하는 특별한 재능이 있습니다'
      }
    ];
    
    // Create character function
    const characters: THREE.Group[] = [];
    
    function createCharacter(data: any) {
      const group = new THREE.Group();
      
      // Body parts
      const torsoGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 8);
      const torsoMaterial = new THREE.MeshStandardMaterial({ color: data.shirtColor });
      const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
      torso.position.y = 0.6;
      torso.castShadow = true;
      group.add(torso);
      
      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6);
      const armMaterial = new THREE.MeshStandardMaterial({ color: data.shirtColor });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.3, 0.7, 0);
      leftArm.rotation.z = Math.PI / 8;
      group.add(leftArm);
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.3, 0.7, 0);
      rightArm.rotation.z = -Math.PI / 8;
      group.add(rightArm);
      
      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, 0.4, 0);
      group.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, 0.4, 0);
      group.add(rightLeg);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 8, 6);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.25;
      head.castShadow = true;
      group.add(head);
      
      // Hair
      const hairGeometry = new THREE.SphereGeometry(0.27, 8, 6);
      const hairMaterial = new THREE.MeshStandardMaterial({ color: data.hairColor });
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      hair.position.y = 1.35;
      hair.scale.y = 0.6;
      group.add(hair);
      
      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.03, 4, 4);
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.08, 1.25, 0.22);
      group.add(leftEye);
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.08, 1.25, 0.22);
      group.add(rightEye);
      
      // Add selection ring (hidden by default)
      const ringGeometry = new THREE.RingGeometry(0.6, 0.7, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const selectionRing = new THREE.Mesh(ringGeometry, ringMaterial);
      selectionRing.rotation.x = -Math.PI / 2;
      selectionRing.position.y = 0.01;
      selectionRing.visible = false;
      group.add(selectionRing);
      
      // Set position and user data
      group.position.set(...data.position);
      group.userData = {
        ...data,
        conversations: [],
        initialPosition: new THREE.Vector3(...data.position),
        targetPosition: new THREE.Vector3(...data.position),
        moveTimer: 0,
        isDancing: false,
        leftArm,
        rightArm,
        clickable: true,
        selectionRing
      };
      
      return group;
    }
    
    // Add characters to scene
    charactersData.forEach(data => {
      const character = createCharacter(data);
      characters.push(character);
      scene.add(character);
    });
    
    // Store characters reference for raycaster
    charactersRef.current = characters;
    
    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // 대화창이 열려있을 때는 입력 처리 안함
      if (dialogueOpen && e.key !== 'Escape') return;
      
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.key] = true;
      
      if (e.key.toLowerCase() === 'e' && !dialogueOpen) {
        e.preventDefault();
        console.log('E key pressed, nearby character:', nearbyCharacterRef.current);
        if (nearbyCharacterRef.current) {
          openDialogue(nearbyCharacterRef.current);
        }
      }
      
      if (e.key === ' ' && !dialogueOpen) {
        e.preventDefault();
        playerRef.current.isDancing = true;
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === 'Escape') {
        setDialogueOpen(false);
        setCurrentCharacter(null);
        if (document.pointerLockElement === renderer.domElement) {
          document.exitPointerLock();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.key] = false;
      
      if (e.key === ' ' && !dialogueOpen) {
        playerRef.current.isDancing = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Mouse controls (fixed direction)
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === renderer.domElement && !dialogueOpen) {
        mouseRef.current.x -= e.movementX * 0.002;  // 반대로 변경
      }
      
      // Update cursor visibility
      if (dialogueOpen) {
        renderer.domElement.style.cursor = 'default';
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Mouse position tracking for raycaster
    const handleMousePosition = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVectorRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVectorRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMousePosition);
    
    // Click handler for character selection and pointer lock
    const handleClick = (e: MouseEvent) => {
      if (!dialogueOpen) {
        // Update mouse position for this click
        const rect = renderer.domElement.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Check if clicking on a character
        raycasterRef.current.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
        const intersects = raycasterRef.current.intersectObjects(charactersRef.current, true);
        
        if (intersects.length > 0) {
          // Find the character group
          let clickedObject = intersects[0].object;
          while (clickedObject.parent && !clickedObject.userData.clickable) {
            clickedObject = clickedObject.parent;
          }
          
          if (clickedObject.userData.clickable) {
            console.log('Clicked on character:', clickedObject.userData.name);
            openDialogue(clickedObject);
            return;
          }
        }
        
        // If not clicking on character, request pointer lock
        renderer.domElement.requestPointerLock();
      }
    };
    
    renderer.domElement.addEventListener('click', handleClick);
    
    // Dialogue system
    function generateDialogueOptions() {
      const allQuestions = [
        t('roleQuestion'),
        t('typicalDayQuestion'),
        t('challengingPartQuestion'),
        t('rewardingMomentQuestion'),
        t('youthPolicyQuestion'),
        t('currentProjectQuestion'),
        t('researchMethodQuestion'),
        t('policyImpactQuestion'),
        t('youthVoiceQuestion'),
        t('futureVisionQuestion'),
        t('collaborationQuestion'),
        t('dataAnalysisQuestion'),
        t('policyDevelopmentQuestion'),
        t('evaluationMethodQuestion'),
        t('internationalComparisonQuestion'),
        t('technologyRoleQuestion'),
        t('mentalHealthQuestion'),
        t('educationPolicyQuestion'),
        t('youthParticipationQuestion'),
        t('evidenceBasedQuestion')
      ];
      
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 4);
    }
    
    function openDialogue(character: any) {
      console.log('Opening dialogue with:', character.userData.name);
      setCurrentCharacter(character);
      setDialogueOpen(true);
      
      if (document.pointerLockElement === rendererRef.current?.domElement) {
        document.exitPointerLock();
      }
      
      const greetings = [
        `안녕하세요! 저는 ${character.userData.name}, ${character.userData.role}입니다. 무엇이든 물어보세요!`,
        `반갑습니다! ${character.userData.name}입니다. ${character.userData.quirk}`,
        `안녕하세요! ${character.userData.role}를 맡고 있는 ${character.userData.name}입니다. 어떤 것이 궁금하신가요?`
      ];
      
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      setDialogueContent(greeting);
      setDialogueOptions(generateDialogueOptions());
    }
    
    // Animation loop
    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const player = playerRef.current;
      const keys = keysRef.current;
      const mouse = mouseRef.current;
      
      // Update player movement
      player.velocity.set(0, 0, 0);
      
      if (!player.isDancing && !dialogueOpen) {
        if (keys['w']) player.velocity.z = player.speed;
        if (keys['s']) player.velocity.z = -player.speed;
        if (keys['a']) player.velocity.x = -player.speed;
        if (keys['d']) player.velocity.x = player.speed;
      }
      
      // Arrow key camera controls (fixed direction)
      const lookSpeed = 0.05;
      if (!dialogueOpen) {
        if (keys['ArrowLeft']) mouse.x -= lookSpeed;
        if (keys['ArrowRight']) mouse.x += lookSpeed;
      }
      
      // Update camera
      if (cameraRef.current) {
        if (!player.isDancing && !dialogueOpen) {
          cameraRef.current.rotation.y = mouse.x;
          cameraRef.current.rotation.x = 0;
        }
        
        // Apply movement
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(cameraRef.current.quaternion);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(cameraRef.current.quaternion);
        right.y = 0;
        right.normalize();
        
        player.position.add(forward.multiplyScalar(player.velocity.z));
        player.position.add(right.multiplyScalar(player.velocity.x));
        
        // Keep in bounds
        player.position.x = Math.max(-18, Math.min(18, player.position.x));
        player.position.z = Math.max(-18, Math.min(18, player.position.z));
        
        // Update camera position
        if (player.isDancing && !dialogueOpen) {
          cameraRef.current.position.y = player.position.y + Math.sin(Date.now() * 0.01) * 0.2;
          cameraRef.current.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
          cameraRef.current.rotation.y = mouse.x;
          cameraRef.current.rotation.x = 0;
        } else {
          cameraRef.current.position.copy(player.position);
          cameraRef.current.rotation.z = 0;
          if (!dialogueOpen) {
            cameraRef.current.rotation.y = mouse.x;
            cameraRef.current.rotation.x = 0;
          }
        }
      }
      
      // Update character animations
      characters.forEach(character => {
        // Add glow effect for nearby or hovered characters
        const isNearby = character === nearbyCharacterRef.current;
        const isHovered = character === hoveredCharacterRef.current;
        
        if (isNearby || isHovered) {
          character.scale.set(1.05, 1.05, 1.05);
          // Add subtle bounce
          character.position.y = character.userData.initialPosition.y + Math.sin(Date.now() * 0.005) * 0.05;
          // Show selection ring
          if (character.userData.selectionRing) {
            character.userData.selectionRing.visible = true;
            character.userData.selectionRing.material.color.setHex(isHovered ? 0x00ffff : 0x00ff00);
            character.userData.selectionRing.scale.set(
              1 + Math.sin(Date.now() * 0.003) * 0.1,
              1 + Math.sin(Date.now() * 0.003) * 0.1,
              1
            );
          }
        } else {
          character.scale.set(1, 1, 1);
          character.position.y = character.userData.initialPosition.y;
          // Hide selection ring
          if (character.userData.selectionRing) {
            character.userData.selectionRing.visible = false;
          }
        }
        
        if (character.userData.isDancing) {
          character.rotation.y += 0.1;
          character.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.3;
          
          character.userData.leftArm.rotation.z = Math.sin(Date.now() * 0.01) * 0.5 + Math.PI / 8;
          character.userData.rightArm.rotation.z = -Math.sin(Date.now() * 0.01) * 0.5 - Math.PI / 8;
        } else if (character === currentCharacter) {
          // Face the player
          const lookTarget = new THREE.Vector3(
            player.position.x, 
            character.position.y, 
            player.position.z
          );
          character.lookAt(lookTarget);
          character.rotation.x = 0;
          character.rotation.z = 0;
        }
      });
      
      // Check for nearby characters
      let nearby = null;
      let minDistance = Infinity;
      
      characters.forEach(character => {
        const distance = player.position.distanceTo(character.position);
        if (distance < 3 && distance < minDistance) {
          minDistance = distance;
          nearby = character;
        }
      });
      
      // Update nearby character state if changed
      if (nearby !== nearbyCharacterRef.current) {
        nearbyCharacterRef.current = nearby;
        setNearbyCharacter(nearby);
      }
      
      // Check for hovered character (when not in pointer lock)
      if (!document.pointerLockElement && !dialogueOpen) {
        raycasterRef.current.setFromCamera(mouseVectorRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(charactersRef.current, true);
        
        if (intersects.length > 0) {
          let hoveredObject = intersects[0].object;
          while (hoveredObject.parent && !hoveredObject.userData.clickable) {
            hoveredObject = hoveredObject.parent;
          }
          
          if (hoveredObject.userData.clickable && hoveredObject !== hoveredCharacterRef.current) {
            hoveredCharacterRef.current = hoveredObject;
            setHoveredCharacter(hoveredObject);
            renderer.domElement.style.cursor = 'pointer';
          }
        } else if (hoveredCharacterRef.current) {
          hoveredCharacterRef.current = null;
          setHoveredCharacter(null);
          renderer.domElement.style.cursor = 'default';
        }
      } else if (dialogueOpen) {
        // Ensure cursor stays visible during dialogue
        renderer.domElement.style.cursor = 'default';
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Pointer lock change handler
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === rendererRef.current?.domElement;
      setIsPointerLocked(locked);
      
      if (rendererRef.current) {
        if (locked) {
          rendererRef.current.domElement.style.cursor = 'none';
        } else {
          rendererRef.current.domElement.style.cursor = dialogueOpen ? 'default' : 'crosshair';
        }
      }
    };
    
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMousePosition);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
    };
  }, []);
  
  const handleOptionClick = async (option: string) => {
    if (!currentCharacter) return;
    
    // Show loading state
    setDialogueContent(prev => 
      `${prev}\n\n${t('youLabel')} ${option}\n\n${currentCharacter.userData.name}: 생각 중...`
    );
    
    // Force scroll to bottom after content update
    setTimeout(() => {
      const dialogueContentEl = document.querySelector('.dialogue-content');
      if (dialogueContentEl) {
        dialogueContentEl.scrollTop = dialogueContentEl.scrollHeight;
      }
    }, 10);
    
    let response = '';
    
    // Try to use Gemini API if available
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
      try {
        const apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `당신은 ${currentCharacter.userData.name}이고, ${currentCharacter.userData.role}입니다.
성격: ${currentCharacter.userData.personality}
특징: ${currentCharacter.userData.quirk}

사용자 질문: "${option}"

한국청소년정책연구원의 직원으로서 친근하고 전문적으로 답변해주세요. 답변은 2-3문장으로 구체적이고 도움이 되도록 작성하세요.`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 200,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ]
            })
          }
        );
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            response = data.candidates[0].content.parts[0].text;
            console.log('Gemini API response:', response);
          } else {
            console.warn('Unexpected Gemini API response format:', data);
            response = generateResponse(currentCharacter, option);
          }
        } else {
          const errorData = await apiResponse.json();
          console.error('Gemini API error response:', errorData);
          response = generateResponse(currentCharacter, option);
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        response = generateResponse(currentCharacter, option);
      }
    } else {
      // Notify user to set up Gemini API key
      console.log('Gemini API key not configured. To enable AI-powered responses, add your Gemini API key to the .env file.');
      response = generateResponse(currentCharacter, option);
    }
    
    // Update dialogue with actual response
    setDialogueContent(prev => 
      prev.replace('생각 중...', response)
    );
    
    // Generate new options
    setDialogueOptions(generateDialogueOptions());
    
    // Force scroll to bottom after response
    setTimeout(() => {
      const dialogueContentEl = document.querySelector('.dialogue-content');
      if (dialogueContentEl) {
        dialogueContentEl.scrollTop = dialogueContentEl.scrollHeight;
      }
    }, 10);
    
    // Save conversation
    currentCharacter.userData.conversations.push({
      user: option,
      response: response
    });
  };
  
  const handleCustomQuestion = () => {
    if (customQuestion.trim() && currentCharacter) {
      handleOptionClick(customQuestion);
      setCustomQuestion('');
    }
  };
  
  // Response generator
  function generateResponse(character: any, question: string): string {
    const responses: { [key: string]: { [key: string]: string[] } } = {
      '김미래': {
        'role': ['홍보담당관으로서 청소년정책연구원의 활동을 널리 알리고, 청소년들과 소통하는 일을 합니다. 청소년들의 목소리를 듣는 것이 가장 보람있어요!'],
        'typical': ['아침에는 SNS와 홈페이지를 점검하고, 오후에는 청소년 단체와 미팅을 하거나 홍보 자료를 만듭니다. 매일이 새로워요!'],
        'challenge': ['청소년들이 정책에 관심을 갖도록 하는 것이 쉽지 않아요. 하지만 재미있고 쉬운 방법으로 전달하려고 노력합니다!'],
        'rewarding': ['청소년들이 우리 정책으로 실제로 도움을 받았다는 이야기를 들을 때가 가장 보람있어요. 작은 변화가 큰 희망이 됩니다!'],
        'policy': ['청소년 정책은 단순한 규정이 아니라 청소년의 꿈과 미래를 지원하는 약속입니다. 모든 청소년이 행복한 세상을 만들고 싶어요.'],
        'project': ['최근에는 청소년 SNS 홍보대사 프로그램을 진행하고 있어요. 청소년들이 직접 정책을 알리는 주체가 되는 거죠!'],
        'method': ['소셜미디어 분석, 청소년 인터뷰, 설문조사 등 다양한 방법으로 청소년의 관심사를 파악합니다.'],
        'voice': ['청소년 참여단을 운영하고, 정기적인 간담회를 열어요. 온라인 플랫폼을 통해서도 의견을 수렴합니다.'],
        'future': ['디지털 네이티브인 청소년들을 위한 맞춤형 정책이 더 중요해질 거예요. AI와 메타버스도 활용할 계획입니다!'],
        'mental': ['청소년 정신건강은 정말 중요한 이슈예요. 온라인 상담 플랫폼과 예방 프로그램을 홍보하고 있습니다.'],
        'default': ['좋은 질문이에요! 청소년 정책은 미래를 위한 투자입니다. 함께 더 나은 내일을 만들어가요!']
      },
      '박서진': {
        'role': ['안내데스크에서 방문객들을 맞이하고 필요한 정보를 제공합니다. 모든 분들이 편안하게 느끼실 수 있도록 노력해요.'],
        'typical': ['방문 예약을 확인하고, 자료를 준비하며, 견학 프로그램을 안내합니다. 다양한 사람들을 만나는 것이 즐거워요!'],
        'challenge': ['때로는 복잡한 문의사항도 있지만, 차분히 해결해나가려고 합니다. 모든 방문객의 이름을 기억하는 것도 도전이죠!'],
        'rewarding': ['방문객분들이 "덕분에 많이 배웠어요"라고 말씀해주실 때 정말 뿌듯해요. 작은 도움이 큰 변화를 만들 수 있거든요.'],
        'policy': ['청소년 정책은 청소년들이 안전하고 행복하게 성장할 수 있는 환경을 만드는 것이죠. 우리 모두의 미래를 위한 투자예요.'],
        'project': ['방문객 맞춤형 견학 프로그램을 개발 중이에요. VR 투어도 준비하고 있답니다!'],
        'collaboration': ['교육청, 학교, 청소년 단체들과 긴밀히 협력해요. 네트워킹 행사도 자주 개최합니다.'],
        'default': ['환영합니다! 청소년정책연구원은 여러분을 위한 곳입니다. 편하게 둘러보세요!']
      },
      '이연구': {
        'role': ['선임연구위원으로서 청소년 정책 개발을 위한 연구를 수행합니다. 데이터를 분석하여 실효성 있는 정책을 만들어요.'],
        'typical': ['연구 데이터를 분석하고, 보고서를 작성하며, 정책 제안을 준비합니다. 숫자 속에서 청소년의 이야기를 찾아냅니다.'],
        'challenge': ['복잡한 현실을 정확히 파악하고 실용적인 해결책을 찾는 것이 어려워요. 하지만 그만큼 보람도 큽니다!'],
        'rewarding': ['우리 연구가 실제 정책으로 만들어져서 청소년들의 삶을 개선했을 때가 가장 보람있어요. 연구의 가치를 실감합니다.'],
        'method': ['빅데이터 분석, 설문조사, 심층인터뷰, 포커스그룹 등 다양한 연구방법을 활용합니다. 혼합연구방법론을 선호해요.'],
        'data': ['청소년 실태조사 데이터를 시계열로 분석하고, AI를 활용한 예측 모델도 개발하고 있어요. 데이터가 정책의 근거가 됩니다.'],
        'evidence': ['증거 기반 정책은 추측이 아닌 실제 데이터와 연구 결과를 바탕으로 만드는 정책이에요. 더 효과적이고 신뢰할 수 있죠.'],
        'international': ['OECD 국가들의 청소년 정책을 비교 연구해요. 한국의 특수성을 고려하면서도 글로벌 트렌드를 반영합니다.'],
        'technology': ['디지털 기술이 청소년 삶을 크게 바꾸고 있어요. 디지털 리터러시, 사이버 안전, AI 윤리 등을 연구합니다.'],
        'default': ['연구는 더 나은 정책의 시작입니다. 증거 기반의 정책으로 청소년의 삶을 개선할 수 있어요!']
      },
      '최정책': {
        'role': ['정책개발팀장으로서 연구 결과를 실제 정책으로 만드는 일을 합니다. 청소년의 목소리가 정책에 반영되도록 노력해요.'],
        'typical': ['정책 초안을 작성하고, 관계 부처와 협의하며, 공청회를 준비합니다. 매일이 도전이지만 보람차요!'],
        'policy': ['좋은 정책은 청소년의 현재를 지원하고 미래를 준비하는 것이죠. 실효성과 지속가능성을 항상 고민합니다.'],
        'development': ['정책 개발은 현황 분석, 이해관계자 의견 수렴, 초안 작성, 시범 운영, 피드백 반영의 과정을 거칩니다.'],
        'evaluation': ['정책 시행 후 6개월, 1년 단위로 효과성을 평가해요. 양적 지표와 질적 평가를 모두 활용합니다.'],
        'youth': ['청소년 정책위원회를 운영하고, 온라인 플랫폼을 통해 상시 의견을 받아요. 청소년이 정책의 주인공이니까요!'],
        'default': ['정책은 청소년의 삶을 실질적으로 개선하는 도구입니다. 함께 더 나은 정책을 만들어가요!']
      },
      '강교육': {
        'role': ['교육프로그램 코디네이터로서 청소년과 관련 종사자들을 위한 교육 프로그램을 기획하고 운영합니다.'],
        'typical': ['교육 커리큘럼을 개발하고, 강사진을 섭외하며, 교육 효과를 평가합니다. 교육을 통한 변화를 봅니다!'],
        'method': ['참여형 학습, 프로젝트 기반 학습, 디지털 도구 활용 등 다양한 교육 방법을 적용해요. 재미있게 배우는 것이 중요하죠!'],
        'project': ['청소년 리더십 아카데미와 또래상담사 양성 프로그램을 운영 중이에요. 청소년이 청소년을 돕는 시스템입니다.'],
        'education': ['교육 정책과 청소년 정책은 떼려야 뗄 수 없어요. 학교 밖 청소년을 위한 대안교육도 중요하게 다룹니다.'],
        'participation': ['청소년들이 직접 프로그램을 기획하고 운영하도록 해요. 주도성과 책임감을 기를 수 있습니다.'],
        'default': ['교육은 청소년의 가능성을 키우는 열쇠입니다. 모든 청소년이 자신의 재능을 발견할 수 있도록 돕고 싶어요!']
      },
      '신상담': {
        'role': ['청소년상담 전문가로서 청소년들의 고민을 듣고 함께 해결책을 찾아갑니다. 마음의 동반자가 되고자 해요.'],
        'typical': ['개인상담과 집단상담을 진행하고, 상담 프로그램을 개발합니다. 청소년의 마음을 이해하는 것이 일의 시작이에요.'],
        'challenge': ['청소년들이 마음을 열기까지 시간이 걸려요. 하지만 신뢰 관계가 형성되면 놀라운 변화가 일어납니다.'],
        'rewarding': ['상담을 통해 자신감을 회복한 청소년을 볼 때가 가장 뿌듯해요. 작은 변화가 인생을 바꿀 수 있거든요.'],
        'mental': ['청소년 우울, 불안, 스트레스가 증가하고 있어요. 예방 프로그램과 조기 개입이 중요합니다. 온라인 상담도 활성화하고 있어요.'],
        'method': ['인지행동치료, 해결중심상담, 예술치료 등 다양한 상담 기법을 활용해요. 청소년 개개인에게 맞는 접근이 중요합니다.'],
        'voice': ['상담에서는 청소년의 이야기를 경청하는 것이 가장 중요해요. 판단하지 않고 공감하며 들어줍니다.'],
        'default': ['모든 청소년은 행복할 권리가 있어요. 힘든 시기를 함께 이겨낼 수 있도록 돕는 것이 제 역할입니다.']
      },
      'default': {
        'default': ['흥미로운 질문이네요! 청소년 정책은 우리 모두의 미래를 위한 것입니다. 함께 만들어가요!']
      }
    };
    
    const characterResponses = responses[character.userData.name] || responses['default'];
    const questionLower = question.toLowerCase();
    
    let responseKey = 'default';
    if (questionLower.includes('역할') || questionLower.includes('어떤 일')) responseKey = 'role';
    else if (questionLower.includes('일과') || questionLower.includes('하루') || questionLower.includes('평소')) responseKey = 'typical';
    else if (questionLower.includes('어려운') || questionLower.includes('힘든') || questionLower.includes('도전')) responseKey = 'challenge';
    else if (questionLower.includes('보람') || questionLower.includes('뿌듯')) responseKey = 'rewarding';
    else if (questionLower.includes('정책') && questionLower.includes('중요')) responseKey = 'policy';
    else if (questionLower.includes('프로젝트') || questionLower.includes('진행')) responseKey = 'project';
    else if (questionLower.includes('연구') && questionLower.includes('방법')) responseKey = 'method';
    else if (questionLower.includes('목소리') || questionLower.includes('반영')) responseKey = 'voice';
    else if (questionLower.includes('미래') || questionLower.includes('앞으로')) responseKey = 'future';
    else if (questionLower.includes('정신건강') || questionLower.includes('마음')) responseKey = 'mental';
    else if (questionLower.includes('데이터') || questionLower.includes('분석')) responseKey = 'data';
    else if (questionLower.includes('증거') || questionLower.includes('기반')) responseKey = 'evidence';
    else if (questionLower.includes('해외') || questionLower.includes('국제')) responseKey = 'international';
    else if (questionLower.includes('기술') || questionLower.includes('디지털')) responseKey = 'technology';
    else if (questionLower.includes('개발') && questionLower.includes('과정')) responseKey = 'development';
    else if (questionLower.includes('평가') || questionLower.includes('효과')) responseKey = 'evaluation';
    else if (questionLower.includes('참여') || questionLower.includes('촉진')) responseKey = 'participation';
    else if (questionLower.includes('교육') && questionLower.includes('연계')) responseKey = 'education';
    else if (questionLower.includes('협력') || questionLower.includes('다른 기관')) responseKey = 'collaboration';
    else if (questionLower.includes('청소년') && questionLower.includes('참여')) responseKey = 'youth';
    
    const responseArray = characterResponses[responseKey] || characterResponses['default'];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }
  
  // Generate dialogue options
  function generateDialogueOptions() {
    const allQuestions = [
      t('roleQuestion'),
      t('typicalDayQuestion'),
      t('challengingPartQuestion'),
      t('rewardingMomentQuestion'),
      t('youthPolicyQuestion'),
      t('currentProjectQuestion'),
      t('researchMethodQuestion'),
      t('policyImpactQuestion'),
      t('youthVoiceQuestion'),
      t('futureVisionQuestion'),
      t('collaborationQuestion'),
      t('dataAnalysisQuestion'),
      t('policyDevelopmentQuestion'),
      t('evaluationMethodQuestion'),
      t('internationalComparisonQuestion'),
      t('technologyRoleQuestion'),
      t('mentalHealthQuestion'),
      t('educationPolicyQuestion'),
      t('youthParticipationQuestion'),
      t('evidenceBasedQuestion')
    ];
    
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }
  
  return (
    <div className={`virtual-tour-container ${dialogueOpen ? 'dialogue-open' : ''}`}>
      <div ref={mountRef} className={`canvas-container ${isPointerLocked ? 'pointer-locked' : ''}`} />
      
      {/* UI Overlay */}
      <div className="ui-overlay">
        <h2>{t('title')}</h2>
        <p className="subtitle">{t('subtitle')}</p>
        <p>{t('moveInstruction')}</p>
        <p>{t('lookInstruction')}</p>
        <p>{t('interactInstruction')}</p>
        <p>{t('danceInstruction')}</p>
        <p>{t('closeInstruction')}</p>
        <p className="tip">{t('tipInstruction')}</p>
        {!isGeminiEnabled && (
          <p className="tip" style={{ color: '#fbbf24', fontSize: '12px', marginTop: '5px' }}>
            💡 Gemini API가 설정되지 않았습니다. AI 응답을 사용하려면 .env 파일에 API 키를 추가하세요.
          </p>
        )}
      </div>
      
      {/* Dialogue Box */}
      {dialogueOpen && currentCharacter && (
        <div className="dialogue-box">
          <div className="dialogue-header">
            <h3>{currentCharacter.userData.name} - {currentCharacter.userData.role}</h3>
            <button 
              className="close-button" 
              onClick={() => {
                setDialogueOpen(false);
                setCurrentCharacter(null);
                // Reset cursor when closing dialogue
                if (rendererRef.current) {
                  rendererRef.current.domElement.style.cursor = 'default';
                }
              }}
              aria-label="Close dialogue"
            >
              ×
            </button>
          </div>
          <div className="dialogue-content" ref={(el) => {
            if (el) {
              el.scrollTop = el.scrollHeight;
            }
          }}>{dialogueContent}</div>
          <div className="dialogue-options">
            {dialogueOptions.map((option, index) => (
              <div
                key={index}
                className="dialogue-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="custom-question-container">
            <p className="divider">{t('customQuestionDivider')}</p>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomQuestion()}
              placeholder={t('customQuestionPlaceholder')}
              className="custom-question-input"
            />
            <button onClick={handleCustomQuestion} className="ask-button">
              {t('askQuestionButton')}
            </button>
          </div>
        </div>
      )}
      
      {/* Interaction Prompt */}
      {nearbyCharacter && !dialogueOpen && (
        <div className="interaction-prompt">
          {t('pressEToTalkTo')} {nearbyCharacter.userData.name}
        </div>
      )}
      
      {/* Hover Prompt */}
      {hoveredCharacter && !dialogueOpen && !document.pointerLockElement && (
        <div className="interaction-prompt" style={{ cursor: 'pointer' }}>
          클릭하여 {hoveredCharacter.userData.name}와 대화하기
        </div>
      )}
    </div>
  );
};

export default VirtualTour;