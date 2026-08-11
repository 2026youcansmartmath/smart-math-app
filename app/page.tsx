'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen, Printer, PlusCircle, Trash2, LayoutDashboard,
  GraduationCap, Layers, Sparkles, Upload, Loader2, Edit3, Check,
  User, ShieldCheck, PenTool, Eraser, Lasso, CheckCircle,
  FileText, Lock, Calendar, ClipboardList, CheckCircle2, Clock, Send,
  FileSpreadsheet, FolderKanban, ArrowRight, Video, Download, Smartphone, Image as ImageIcon,
  Move, FileQuestion, X, Eye, KeyRound, UserX, FileDown, RotateCcw
} from 'lucide-react';

//
// 1. 동적 연도 생성 헬퍼
//
const START_YEAR = 2022;
const currentYear = new Date().getFullYear();
export const EXAM_YEARS = Array.from(
  { length: currentYear - START_YEAR + 1 },
  (_, i) => `${START_YEAR + i}년`
).reverse();
export const EXAM_MONTHS = ['3월', '4월', '6월', '7월', '9월', '10월', '11월(수능)'];
export const MOCK_GRADES = ['고1', '고2', '고3'];

//
// 2. 2022 개정 교육과정 전체 데이터 구조
//
const curriculumData: Record<string, any> = {
  '초등부': {
    '1학년': {
      '1학기': {
        '1. 9까지의 수': ['9까지의 수 알기'],
        '2. 여러 가지 모양': ['입체도형 모양'],
        '3. 덧셈과 뺄셈': ['모으기와 가르기'],
        '4. 비교하기': ['길이, 무게 비교'],
        '5. 50까지의 수': ['10개씩 묶음과 낱개']
      },
      '2학기': {
        '1. 100까지의 수': ['100까지의 수'],
        '2. 덧셈과 뺄셈(1)': ['두 자리 수 덧뺄셈'],
        '3. 여러 가지 모양': ['평면도형 모양'],
        '4. 세 수의 계산': ['세 수 계산'],
        '5. 시계와 규칙': ['시계 읽기, 규칙']
      }
    },
    '2학년': {
      '1학기': {
        '1. 세 자리 수': ['백, 세 자리 수'],
        '2. 도형의 시각화': ['원, 삼각형, 사각형'],
        '3. 덧셈과 뺄셈': ['받아올림 덧뺄셈'],
        '4. 길이 재기': ['cm 단위'],
        '5. 분류하기': ['기준 분류'],
        '6. 곱셈': ['곱셈의 개념']
      },
      '2학기': {
        '1. 네 자리 수': ['천, 네 자리 수'],
        '2. 곱셈구구': ['2~9단 곱셈구구'],
        '3. 길이 재기': ['m 단위'],
        '4. 시각과 시간': ['분 단위 시각'],
        '5. 표와 그래프': ['자료 정리'],
        '6. 규칙 찾기': ['수와 물체 규칙']
      }
    },
    '3학년': {
      '1학기': {
        '1. 덧셈과 뺄셈': ['세 자리 수 덧뺄셈'],
        '2. 평면도형': ['직각, 직사각형'],
        '3. 나눗셈': ['나눗셈 개념'],
        '4. 곱셈': ['(두 자리)×(한 자리)'],
        '5. 길이와 시간': ['mm, km, 초'],
        '6. 분수와 소수': ['분수, 소수 개념']
      },
      '2학기': {
        '1. 곱셈': ['(두 자리)×(두 자리)'],
        '2. 나눗셈': ['내림, 나머지 나눗셈'],
        '3. 원': ['중심, 반지름, 지름'],
        '4. 분수': ['진분수, 가분수, 대분수'],
        '5. 들이와 무게': ['L, mL, kg, g'],
        '6. 자료의 정리': ['그림그래프']
      }
    },
    '4학년': {
      '1학기': {
        '1. 큰 수': ['만, 억, 조'],
        '2. 각도': ['각도 측정, 삼각형 내각'],
        '3. 곱셈과 나눗셈': ['세 자리 수 곱나눗셈'],
        '4. 평면도형의 이동': ['밀기, 뒤집기, 돌리기'],
        '5. 막대그래프': ['막대그래프 해석'],
        '6. 규칙 찾기': ['수 배열 규칙']
      },
      '2학기': {
        '1. 분수의 덧셈과 뺄셈': ['분모가 같은 분수 덧뺄셈'],
        '2. 삼각형': ['이등변, 정삼각형'],
        '3. 소수의 덧셈과 뺄셈': ['소수 두/세 자리 수'],
        '4. 사각형': ['사다리꼴, 평행사변형, 마름모'],
        '5. 꺾은선그래프': ['꺾은선그래프 그리기'],
        '6. 다각형': ['다각형과 정다각형']
      }
    },
    '5학년': {
      '1학기': {
        '1. 자연수의 혼합 계산': ['덧뺄곱나 혼합계산'],
        '2. 약수와 배수': ['최대공약수, 최소공배수'],
        '3. 규칙과 대응': ['두 양의 대응 관계'],
        '4. 약분과 통분': ['기약분수, 통분'],
        '5. 분수의 곱셈': ['(분수)×(자연수)', '(분수)×(분수)'],
        '6. 다각형의 둘레와 넓이': ['정사각형, 평행사변형 넓이']
      },
      '2학기': {
        '1. 수의 범위와 어림하기': ['이상, 이하, 초과, 미만, 반올림'],
        '2. 분수의 나눗셈': ['(분수)÷(자연수)'],
        '3. 합동과 대칭': ['도형의 합동, 선대칭, 점대칭'],
        '4. 소수의 곱셈': ['소수의 곱셈 연산'],
        '5. 직육면체': ['직육면체, 정육면체 전개도'],
        '6. 평균과 가능성': ['평균 구하기, 가능성 표현']
      }
    },
    '6학년': {
      '1학기': {
        '1. 분수의 나눗셈': ['(분수)÷(분수)'],
        '2. 각기둥과 각뿔': ['각기둥, 각뿔의 성질'],
        '3. 소수의 나눗셈': ['(소수)÷(소수)'],
        '4. 비와 비율': ['비, 비율, 백분율'],
        '5. 여러 가지 그래프': ['띠그래프, 원그래프'],
        '6. 직육면체의 겉넓이와 부피': ['겉넓이, 부피 구하기']
      },
      '2학기': {
        '1. 쌓기나무': ['쌓은 모양과 개수 추정'],
        '2. 비례식과 비례배분': ['비례식 성질, 비례배분'],
        '3. 원의 넓이': ['원주, 원의 넓이'],
        '4. 원기둥, 원뿔, 구': ['입체도형의 특징'],
        '5. 수형도와 확률 기초': ['가능성과 경우의 수']
      }
    }
  },
  '중등부': {
    '1학년': {
      '1학기': {
        'I. 수와 연산': ['1. 소인수분해', '2. 정수와 유리수'],
        'II. 변화와 관계': ['1. 문자의 사용과 식', '2. 일차방정식', '3. 좌표평면과 그래프']
      },
      '2학기': {
        'III. 도형과 측정': ['1. 기본 도형', '2. 평면도형의 성질', '3. 입체도형의 성질'],
        'IV. 통계': ['1. 자료의 정리와 해석']
      }
    },
    '2학년': {
      '1학기': {
        'I. 수와 연산': ['1. 유리수와 순환소수'],
        'II. 변화와 관계': ['1. 식의 계산', '2. 일차부등식', '3. 연립일차방정식', '4. 일차함수와 그래프']
      },
      '2학기': {
        'III. 도형과 측정': ['1. 삼각형의 성질', '2. 사각형의 성질', '3. 도형의 닮음과 피타고라스 정리'],
        'IV. 통계': ['1. 확률과 그 기본 성질']
      }
    },
    '3학년': {
      '1학기': {
        'I. 수와 연산': ['1. 제곱근과 실수', '2. 근호를 포함한 식의 계산'],
        'II. 변화와 관계': ['1. 다항식의 곱셈과 인수분해', '2. 이차방정식', '3. 이차함수와 그래프']
      },
      '2학기': {
        'III. 도형과 측정': ['1. 삼각비', '2. 원의 성질'],
        'IV. 통계': ['1. 대푯값과 산포도', '2. 상관관계']
      }
    }
  },
  '고등부': {
    '공통수학1': {
      '공통': {
        'I. 다항식': ['1. 다항식의 연산', '2. 항등식과 나머지정리', '3. 인수분해'],
        'II. 방정식과 부등식': ['1. 복소수와 이차방정식', '2. 이차방정식과 이차함수', '3. 여러 가지 방정식과 부등식'],
        'III. 도형의 방정식': ['1. 평면좌표', '2. 직선의 방정식', '3. 원의 방정식', '4. 도형의 이동'],
        'IV. 행렬': ['1. 행렬과 그 연산']
      }
    },
    '공통수학2': {
      '공통': {
        'I. 집합과 명제': ['1. 집합의 뜻과 연산', '2. 명제'],
        'II. 함수와 그래프': ['1. 함수', '2. 유리함수와 무리함수'],
        'III. 순열과 조합': ['1. 순열과 조합']
      }
    },
    '대수': {
      '공통': {
        'I. 지수함수와 로그함수': ['1. 지수와 로그', '2. 지수함수와 로그함수'],
        'II. 삼각함수': ['1. 삼각함수', '2. 삼각함수의 그래프와 활용'],
        'III. 수열': ['1. 등차수열과 등비수열', '2. 수열의 합과 수학적 귀납법']
      }
    },
    '미적분 I': {
      '공통': {
        'I. 함수의 극한과 연속': ['1. 함수의 극한', '2. 함수의 연속'],
        'II. 미분': ['1. 미분계수와 도함수', '2. 도함수의 활용'],
        'III. 적분': ['1. 부정적분과 정적분', '2. 정적분의 활용']
      }
    },
    '미적분 II': {
      '선택': {
        'I. 수열의 극한': ['1. 수열의 극한', '2. 급수'],
        'II. 미분법': ['1. 여러 가지 함수의 미분', '2. 여러 가지 미분법', '3. 도함수의 활용'],
        'III. 적분법': ['1. 여러 가지 적분법', '2. 정적분의 활용']
      }
    },
    '확률과 통계': {
      '선택': {
        'I. 경우의 수': ['1. 순열', '2. 조합과 이항정리'],
        'II. 확률': ['1. 확률의 뜻과 활용', '2. 조건부확률'],
        'III. 통계': ['1. 확률변수와 확률분포', '2. 정규분포', '3. 통계적 추정']
      }
    },
    '기하': {
      '선택': {
        'I. 이차곡선': ['1. 포물선, 타원, 쌍곡선', '2. 이차곡선과 직선'],
        'II. 평면벡터': ['1. 벡터의 연산', '2. 평면벡터의 성분과 내적'],
        'III. 공간도형과 공간좌표': ['1. 공간도형', '2. 공간좌표']
      }
    },
    '경제 수학': {
      '선택': {
        'I. 수와 생활경제': ['1. 비율과 수열의 경제적 활용'],
        'II. 수열과 금융': ['1. 이자와 단리/복리', '2. 원리합계와 연금'],
        'III. 미분과 경제': ['1. 미분계수와 한계비용', '2. 최적화 문제']
      }
    }
  },
  '모의고사 기출': {
    '고1': {
      '3월': { '공통과목': ['공통수학1(다항식~행렬)'] },
      '6월': { '공통과목': ['공통수학1 전체'] },
      '9월': { '공통과목': ['공통수학2(집합과 명제~함수)'] },
      '11월(수능)': { '공통과목': ['공통수학2 전체'] }
    },
    '고2': {
      '3월': { '공통과목': ['대수 전체'] },
      '6월': { '공통과목': ['미적분 I 전체'] },
      '9월': { '공통과목': ['확률과 통계'], '선택과목': ['미적분 II'] },
      '11월(수능)': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '기하'] }
    },
    '고3': {
      '3월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '4월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '6월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '7월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '9월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '10월': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] },
      '11월(수능)': { '공통과목': ['대수', '미적분 I'], '선택과목': ['확률과 통계', '미적분 II', '기하'] }
    }
  }
};

// 인터페이스 정의
interface Problem {
  id: string;
  level: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  mockGrade?: string;
  mockYear?: string;
  mockMonth?: string;
  subjectType?: '공통과목' | '선택과목';
  type: 'multiple' | 'subjective';
  title: string;
  content: string;
  contentImage?: string;
  difficulty: string;
  options: string[];
  answer: string;
  explanation: string;
  explanationImage?: string;
  youtubeUrl?: string;
}

interface SavedExamPaper {
  id: string;
  title: string;
  createdAt: string;
  targetLevel: string;
  problems: Problem[];
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  targetLevel: string;
  problemIds: string[];
  targetStudents?: number[]; // 특정 선택 학생 ID 목록 (없거나 비어있으면 전체)
}

interface SubmissionRecord {
  submittedAt: string;
  answers: Record<string, string>;
  score?: number;
  examTitle?: string;
  problems?: Problem[];
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  tool: 'pen' | 'eraser';
  color: string;
  size: number;
  points: Point[];
}

// 올가미 선택 판단
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  let isInside = false;
  let minX = polygon[0].x, maxX = polygon[0].x;
  let minY = polygon[0].y, maxY = polygon[0].y;
  for (let n = 1; n < polygon.length; n++) {
    const q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }
  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
    return false;
  }
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if ((polygon[i].y > point.y) !== (polygon[j].y > point.y) &&
        point.x < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
      isInside = !isInside;
    }
  }
  return isInside;
}

// 초기 기본 문제 샘플
const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'init_1',
    level: '고등부',
    step1: '공통수학1',
    step2: 'I. 다항식',
    step3: '1. 다항식의 연산',
    step4: '',
    type: 'multiple',
    title: '다항식 연산 예제',
    content: '다항식 A = x² + 2x - 1, B = 2x² - x + 3 일 때 2A + B를 간단히 하시오.',
    difficulty: '중',
    options: ['4x² + 3x + 1', '4x² + 3x + 5', '3x² + 3x + 1', '4x² + x + 1', '3x² + x + 5'],
    answer: '1',
    explanation: '2A + B = 2(x² + 2x - 1) + (2x² - x + 3) = 4x² + 3x + 1 이므로 ①번입니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=sample'
  },
  {
    id: 'init_2',
    level: '모의고사 기출',
    step1: '고3',
    step2: '6월',
    step3: '대수',
    step4: '',
    mockGrade: '고3',
    mockYear: '2025년',
    mockMonth: '6월',
    subjectType: '공통과목',
    type: 'subjective',
    title: '2025학년도 6월 모평 기출 예제',
    content: '다항식 (x + 2)(x² - 2x + 4)를 전개하였을 때 x의 계수와 상수항의 합을 구하시오.',
    difficulty: '중',
    options: [],
    answer: '8',
    explanation: '전개식은 x³ + 8 이므로 x 계수는 0, 상수항은 8입니다. 따라서 합은 8입니다.',
    youtubeUrl: 'https://www.youtube.com/watch?v=sample2'
  }
];

export default function SmartMathApp() {
  // 모드 및 메인 뷰 설정
  const [roleMode, setRoleMode] = useState<'teacher' | 'student'>('teacher');
  const [viewMode, setViewMode] = useState<
    'dashboard' | 'generate_exam' | 'saved_exams' | 'assignment_manage' | 'register_manual' | 'register_ai' | 'print'
  >('dashboard');

  // 교사 비밀번호 인증 State
  const [teacherPassword, setTeacherPassword] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('teacherPassword') || '1234';
    }
    return '1234';
  });
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [inputTeacherPassword, setInputTeacherPassword] = useState('');
  const [teacherPassError, setTeacherPassError] = useState('');
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // PWA 웹앱 설치 제어 State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const outcome = await deferredPrompt.userChoice;
    if (outcome.outcome === 'accepted') {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  // 시험지 제목
  const [examTitle, setExamTitle] = useState(`${currentYear}학년도 수학 평가 시험지`);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(examTitle);

  // 교사: 인가 학생 데이터
  const [allowedStudents, setAllowedStudents] = useState<Array<{ id: number; name: string; phone: string }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_math_students_db');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      { id: 1, name: '김철수', phone: '01012345678' },
      { id: 2, name: '이영희', phone: '01098765432' }
    ];
  });
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_math_students_db', JSON.stringify(allowedStudents));
    }
  }, [allowedStudents]);

  // 학생: 로그인 세션
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<{ name: string; phone: string | null } | null>(null);
  const [loginName, setLoginName] = useState('');
  const [loginPhoneLast4, setLoginPhoneLast4] = useState('');
  const [loginError, setLoginError] = useState('');

  // 과제 시스템 및 제출 관리
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_math_assignments_db');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      {
        id: 1,
        title: '대수 지수/로그함수 핵심 과제',
        dueDate: `${currentYear}-08-20`,
        targetLevel: '고등부',
        problemIds: ['init_1'],
        targetStudents: []
      }
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_math_assignments_db', JSON.stringify(assignments));
    }
  }, [assignments]);

  const [submissions, setSubmissions] = useState<Record<string, SubmissionRecord>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_math_submissions_db');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      '1_김철수': {
        submittedAt: `${currentYear}-08-08 14:30`,
        answers: { 'init_1': '1' },
        score: 100,
        examTitle: '대수 지수/로그함수 핵심 과제',
        problems: INITIAL_PROBLEMS.filter(p => p.id === 'init_1')
      }
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_math_submissions_db', JSON.stringify(submissions));
    }
  }, [submissions]);

  const [studentTab, setStudentTab] = useState<'practice' | 'assignment' | 'history'>('practice');

  // 교육과정 분류 선택
  const [selectedLevel, setSelectedLevel] = useState<string>('고등부');
  const [step1, setStep1] = useState<string>('');
  const [step2, setStep2] = useState<string>('');
  const [step3, setStep3] = useState<string>('');
  const [step4, setStep4] = useState<string>('');

  // 모의고사 기출 전용 필터 State
  const [mockGrade, setMockGrade] = useState<string>('');
  const [mockYear, setMockYear] = useState<string>('');
  const [mockMonth, setMockMonth] = useState<string>('');
  const [mockSubjectType, setMockSubjectType] = useState<'공통과목' | '선택과목' | ''>('');

  // 교사 시험지 출제 및 보관함 State
  const [teacherDiff, setTeacherDiff] = useState<string>('전체');
  const [teacherMultCount, setTeacherMultCount] = useState<number>(3);
  const [teacherSubjCount, setTeacherSubjCount] = useState<number>(2);
  const [currentGeneratedExam, setCurrentGeneratedExam] = useState<Problem[]>([]);
  const [generatedExamTitle, setGeneratedExamTitle] = useState<string>('');

  const [savedExams, setSavedExams] = useState<SavedExamPaper[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_math_saved_exams_db');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_math_saved_exams_db', JSON.stringify(savedExams));
    }
  }, [savedExams]);

  const [assignDueDateMap, setAssignDueDateMap] = useState<Record<string, string>>({});
  const [assignTargetStudentsMap, setAssignTargetStudentsMap] = useState<Record<string, number[]>>({});

  // 학생 문제 추출 설정
  const [studentDiff, setStudentDiff] = useState<string>('전체');
  const [multipleCount, setMultipleCount] = useState<number>(3);
  const [subjectiveCount, setSubjectiveCount] = useState<number>(2);
  const [studentSolving, setStudentSolving] = useState<boolean>(false);
  const [solvedProblems, setSolvedProblems] = useState<Problem[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<boolean>(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(null);
  const [currentSolvingTitle, setCurrentSolvingTitle] = useState<string>('');
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<SubmissionRecord | null>(null);

  // 캔버스 필기 도구
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'lasso'>('pen');
  const [penColor, setPenColor] = useState<string>('#ef4444');
  const [penSize, setPenSize] = useState<number>(3);
  const [eraserSize, setEraserSize] = useState<number>(30);
  const [canvasStrokes, setCanvasStrokes] = useState<Record<string, Stroke[]>>({});
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [lassoPoints, setLassoPoints] = useState<Point[]>([]);
  const [selectedStrokeIds, setSelectedStrokeIds] = useState<string[]>([]);
  const [isDraggingSelected, setIsDraggingSelected] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  // 교사 - 제출 결과 상세보기 모달
  const [viewingSubmission, setViewingSubmission] = useState<{
    studentName: string;
    assignmentTitle: string;
    record: SubmissionRecord;
    problems: Problem[];
  } | null>(null);

  // 교사 인쇄 전용 선택 시험지 State
  const [selectedExamToPrint, setSelectedExamToPrint] = useState<SavedExamPaper | null>(null);

  // 문제 데이터베이스 State 및 LocalStorage 동기화
  const [problems, setProblems] = useState<Problem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smart_math_problems_db');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Failed to parse saved problems', e);
        }
      }
    }
    return INITIAL_PROBLEMS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && problems.length > 0) {
      localStorage.setItem('smart_math_problems_db', JSON.stringify(problems));
    }
  }, [problems]);

  // 문제 수정 모달 State
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  // 교사 수동 문제 제작 State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualType, setManualType] = useState<'multiple' | 'subjective'>('multiple');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDifficulty, setManualDifficulty] = useState('중');
  const [manualContent, setManualContent] = useState('');
  const [manualContentImage, setManualContentImage] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');
  const [manualExplanationImage, setManualExplanationImage] = useState('');
  const [manualYoutubeUrl, setManualYoutubeUrl] = useState('');
  const [directAssign, setDirectAssign] = useState(false);
  const [directAssignDueDate, setDirectAssignDueDate] = useState('');

  // AI 캡처 자동 추출 전용 State
  const [aiProblemImage, setAiProblemImage] = useState('');
  const [aiAnswerImage, setAiAnswerImage] = useState('');

  const numIcons = ['①', '②', '③', '④', '⑤'];

  // 드롭다운 옵션 계산
  const step1Options = useMemo(() => Object.keys(curriculumData[selectedLevel] || {}), [selectedLevel]);
  const step2Options = useMemo(() => {
    return step1 ? Object.keys(curriculumData[selectedLevel]?.[step1] || {}) : [];
  }, [selectedLevel, step1]);

  const step3Options = useMemo(() => {
    if (!step1 || !step2) return [];
    const target = curriculumData[selectedLevel]?.[step1]?.[step2];
    return Array.isArray(target) ? target : Object.keys(target || {});
  }, [selectedLevel, step1, step2]);

  const step4Options = useMemo(() => {
    if (!step1 || !step2 || !step3) return [];
    const target = curriculumData[selectedLevel]?.[step1]?.[step2]?.[step3];
    return Array.isArray(target) ? target : [];
  }, [selectedLevel, step1, step2, step3]);

  // 시험지 제목 변경
  const handleSaveTitle = () => {
    if (tempTitle.trim()) setExamTitle(tempTitle.trim());
    setIsEditingTitle(false);
  };

  // 교사 비밀번호 검증
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTeacherPassword === teacherPassword) {
      setIsTeacherAuthenticated(true);
      setTeacherPassError('');
      setInputTeacherPassword('');
    } else {
      setTeacherPassError('교사 비밀번호가 일치하지 않습니다.');
    }
  };

  // 교사 비밀번호 변경
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPasswordInput !== teacherPassword) {
      alert('기존 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!newPasswordInput.trim()) {
      alert('새로운 비밀번호를 입력해주세요.');
      return;
    }
    const updatedPassword = newPasswordInput.trim();
    setTeacherPassword(updatedPassword);
    if (typeof window !== 'undefined') {
      localStorage.setItem('teacherPassword', updatedPassword);
    }
    alert('교사 비밀번호가 성공적으로 변경되었습니다.');
    setShowPasswordChangeModal(false);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
  };

  // 교사: 학생 인가 등록
  const handleAddStudent = () => {
    if (newStudentName && newStudentPhone) {
      setAllowedStudents(prev => [
        ...prev,
        { id: Date.now(), name: newStudentName.trim(), phone: newStudentPhone.replace(/-/g, '').trim() }
      ]);
      setNewStudentName('');
      setNewStudentPhone('');
      alert('학생이 인가 승인되었습니다.');
    }
  };

  // 교사: 학생 퇴원 및 인가 취소
  const handleRemoveStudent = (studentId: number, studentName: string) => {
    if (confirm(`${studentName} 학생을 퇴원 처리하고 승인을 취소하시겠습니까?`)) {
      setAllowedStudents(prev => prev.filter(st => st.id !== studentId));
      alert(`${studentName} 학생의 인가 및 접근 승인이 취소되었습니다.`);
    }
  };

  // 교사: 문제은행 기반 자율 문제셋 생성
  const handleGenerateTeacherExam = () => {
    let filtered = problems.filter(p => p.level === selectedLevel);
    if (step1) filtered = filtered.filter(p => p.step1 === step1);
    if (step2) filtered = filtered.filter(p => p.step2 === step2);
    if (step3) filtered = filtered.filter(p => p.step3 === step3);

    if (selectedLevel === '모의고사 기출') {
      if (mockGrade) filtered = filtered.filter(p => p.mockGrade === mockGrade);
      if (mockYear) filtered = filtered.filter(p => p.mockYear === mockYear);
      if (mockMonth) filtered = filtered.filter(p => p.mockMonth === mockMonth);
      if (mockSubjectType) filtered = filtered.filter(p => p.subjectType === mockSubjectType);
    }

    if (teacherDiff !== '전체') filtered = filtered.filter(p => p.difficulty === teacherDiff);

    const mults = filtered.filter(p => p.type === 'multiple').slice(0, teacherMultCount);
    const subjs = filtered.filter(p => p.type === 'subjective').slice(0, teacherSubjCount);
    const combined = [...mults, ...subjs];

    if (combined.length === 0) {
      alert('조건에 부합하는 문제가 문제은행에 없습니다. 다른 단원이나 조건으로 변경해 보세요!');
      return;
    }
    setCurrentGeneratedExam(combined);
    setGeneratedExamTitle(generatedExamTitle.trim() || `${selectedLevel} ${step1 || ''} 맞춤 출제 시험지`);
  };

  // 교사: 생성된 시험지를 보관함에 저장
  const handleSaveGeneratedExam = () => {
    if (currentGeneratedExam.length === 0) return;
    const newExam: SavedExamPaper = {
      id: `exam_${Date.now()}`,
      title: generatedExamTitle || `${selectedLevel} 자율 출제 시험지`,
      createdAt: new Date().toISOString().split('T')[0],
      targetLevel: selectedLevel,
      problems: currentGeneratedExam
    };
    setSavedExams(prev => [newExam, ...prev]);
    alert(`"${newExam.title}" 시험지가 출제 보관함에 저장되었습니다!`);
    setCurrentGeneratedExam([]);
    setGeneratedExamTitle('');
    setViewMode('saved_exams');
  };

  // 교사: 보관함 시험지 삭제
  const handleDeleteSavedExam = (examId: string, title: string) => {
    if (confirm(`"${title}" 시험지를 출제 보관함에서 삭제하시겠습니까?`)) {
      setSavedExams(prev => prev.filter(e => e.id !== examId));
      alert('시험지가 삭제되었습니다.');
    }
  };

  // 교사: 보관함 시험지를 학생들에게 과제로 부과 (개별 대상 선택 가능)
  const handleAssignExamToStudents = (exam: SavedExamPaper) => {
    const dueDate = assignDueDateMap[exam.id];
    if (!dueDate) {
      alert('과제 마감일을 선택해주세요.');
      return;
    }
    const targetStudents = assignTargetStudentsMap[exam.id] || [];

    const newAssignment: Assignment = {
      id: Date.now(),
      title: `[보관함 출제] ${exam.title}`,
      dueDate: dueDate,
      targetLevel: exam.targetLevel,
      problemIds: exam.problems.map(p => p.id),
      targetStudents: targetStudents
    };
    setAssignments(prev => [newAssignment, ...prev]);
    alert(`"${exam.title}" 시험지가 ${targetStudents.length > 0 ? `${targetStudents.length}명의 지정 학생` : '전체 학생'} 과제로 부과되었습니다!`);
  };

  // 교사: 과제 마감 기한 수정 기능
  const handleUpdateAssignmentDueDate = (assignmentId: number, newDueDate: string) => {
    if (!newDueDate) return;
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, dueDate: newDueDate } : a));
    alert('과제 마감 기간이 변경되었습니다.');
  };

  // 교사: 과제 삭제 기능
  const handleDeleteAssignment = (assignmentId: number, title: string) => {
    if (confirm(`"${title}" 과제를 삭제하시겠습니까?`)) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      alert('과제가 삭제되었습니다.');
    }
  };

  // 이미지 붙여넣기 헬퍼
  const readPastedImage = (e: React.ClipboardEvent): Promise<string | null> => {
    return new Promise((resolve) => {
      const items = e.clipboardData?.items;
      if (!items) return resolve(null);
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      resolve(null);
    });
  };

  // 교사: 수동 문제 직접 제작 제출
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualContent.trim() && !manualContentImage) {
      alert('문제 지문(텍스트 또는 이미지 캡처)을 입력해 주세요.');
      return;
    }
    const newId = `problem_${Date.now()}`;
    const newProblem: Problem = {
      id: newId,
      level: selectedLevel,
      step1: step1 || (selectedLevel === '모의고사 기출' ? mockGrade : '공통수학1'),
      step2: step2 || (selectedLevel === '모의고사 기출' ? mockMonth : ''),
      step3: step3 || '',
      step4: step4 || '',
      mockGrade: selectedLevel === '모의고사 기출' ? mockGrade : undefined,
      mockYear: selectedLevel === '모의고사 기출' ? mockYear : undefined,
      mockMonth: selectedLevel === '모의고사 기출' ? mockMonth : undefined,
      subjectType: selectedLevel === '모의고사 기출' ? (mockSubjectType || '공통과목') : undefined,
      type: manualType,
      title: manualTitle.trim() || `${manualType === 'multiple' ? '객관식' : '주관식'} 직접 제작 문제 (${problems.length + 1})`,
      content: manualContent,
      contentImage: manualContentImage || undefined,
      difficulty: manualDifficulty,
      options: manualType === 'multiple' ? ['', '', '', '', ''] : [],
      answer: manualAnswer,
      explanation: manualExplanation,
      explanationImage: manualExplanationImage || undefined,
      youtubeUrl: manualYoutubeUrl.trim()
    };

    setProblems(prev => [...prev, newProblem]);

    if (directAssign) {
      if (!directAssignDueDate) {
        alert('과제 마감일을 지정해주세요.');
        return;
      }
      setAssignments(prev => [
        ...prev,
        {
          id: Date.now(),
          title: `[직접부여] ${newProblem.title}`,
          dueDate: directAssignDueDate,
          targetLevel: selectedLevel,
          problemIds: [newId],
          targetStudents: []
        }
      ]);
      alert('문제가 제작되었으며 지정한 마감일로 과제가 즉시 부과되었습니다.');
    } else {
      alert('문제가 문제 은행에 성공적으로 추가되었으며 영구 보관됩니다.');
    }

    setManualTitle('');
    setManualContent('');
    setManualContentImage('');
    setManualAnswer('');
    setManualExplanation('');
    setManualExplanationImage('');
    setManualYoutubeUrl('');
    setDirectAssign(false);
    setViewMode('dashboard');
  };

  // 교사: 문제 수정 완료
  const handleUpdateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;
    setProblems(prev => prev.map(p => p.id === editingProblem.id ? editingProblem : p));
    alert('문제 내용이 성공적으로 수정되었습니다.');
    setEditingProblem(null);
  };

  // 학생: 로그인 인증
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = allowedStudents.find(
      s => s.name.trim() === loginName.trim() && s.phone.slice(-4) === loginPhoneLast4.trim()
    );
    if (matched) {
      setIsAuthenticated(true);
      setCurrentStudent({ name: matched.name, phone: matched.phone });
      setLoginError('');
    } else {
      setLoginError('등록된 학생 정보가 없거나 전화번호 뒤 4자리가 일치하지 않습니다.');
    }
  };

  // 학생: 결과 및 과제 제출
  const handleSubmitStudentWork = () => {
    if (!currentStudent) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let correctCount = 0;
    solvedProblems.forEach(prob => {
      const studentAns = (studentAnswers[prob.id] || '').trim().toLowerCase();
      const realAns = (prob.answer || '').trim().toLowerCase();
      if (studentAns && realAns && studentAns === realAns) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / (solvedProblems.length || 1)) * 100);

    const recordKey = activeAssignmentId
      ? `${activeAssignmentId}_${currentStudent.name}`
      : `practice_${Date.now()}_${currentStudent.name}`;

    const submissionData: SubmissionRecord = {
      submittedAt: dateStr,
      answers: studentAnswers,
      score: calculatedScore,
      examTitle: currentSolvingTitle || '자율 맞춤 문제 풀이',
      problems: solvedProblems
    };

    setSubmissions(prev => ({
      ...prev,
      [recordKey]: submissionData
    }));

    if (activeAssignmentId) {
      alert('과제 결과 제출 완료! 선생님 대시보드로 채점 정답 및 해설 정보가 전달되었습니다.');
    } else {
      alert(`자율 풀이가 제출되었습니다! (점수: ${calculatedScore}점)`);
    }
    setShowResult(true);
  };

  // AI 분리 캡처 처리
  const processMultiSegmentationAI = async () => {
    if (!aiProblemImage || !aiAnswerImage) {
      alert('문제 캡처 이미지와 답지 캡처 이미지를 모두 붙여넣어 주세요.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/parse-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemBase64: aiProblemImage,
          answerBase64: aiAnswerImage,
          selectedLevel,
          step1,
          step2,
          step3,
          mockGrade,
          mockYear,
          mockMonth,
          mockSubjectType
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI 추출 및 자동 일치 저장 실패');

      if (data.problems && Array.isArray(data.problems)) {
        const newItems: Problem[] = data.problems.map((item: any, idx: number) => ({
          id: `gemini_${Date.now()}_${idx}`,
          level: selectedLevel,
          step1: step1 || '미선택',
          step2: step2 || '',
          step3: step3 || '',
          step4: step4 || '',
          mockGrade: selectedLevel === '모의고사 기출' ? mockGrade : undefined,
          mockYear: selectedLevel === '모의고사 기출' ? mockYear : undefined,
          mockMonth: selectedLevel === '모의고사 기출' ? mockMonth : undefined,
          subjectType: selectedLevel === '모의고사 기출' ? (mockSubjectType || '공통과목') : undefined,
          type: item.type === 'subjective' ? 'subjective' : 'multiple',
          title: item.title || `AI 추출 문제 ${idx + 1}`,
          content: item.content || '',
          contentImage: item.contentImage || undefined,
          difficulty: item.difficulty || '중',
          options: item.options || [],
          answer: item.answer || '',
          explanation: item.explanation || '',
          explanationImage: item.explanationImage || undefined,
          youtubeUrl: item.youtubeUrl || ''
        }));

        setProblems(prev => [...prev, ...newItems]);
        alert(`AI 분석 완료! 총 ${newItems.length}개의 문제와 답지가 자동으로 일치하여 문제은행에 저장되었습니다.`);
        setAiProblemImage('');
        setAiAnswerImage('');
        setViewMode('dashboard');
      }
    } catch (err: any) {
      alert(`오류 발생: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 학생 연습문제 시작
  const startStudentTest = () => {
    let filtered = problems.filter(p => p.level === selectedLevel);
    if (step1) filtered = filtered.filter(p => p.step1 === step1);
    if (step2) filtered = filtered.filter(p => p.step2 === step2);
    if (step3) filtered = filtered.filter(p => p.step3 === step3);

    if (selectedLevel === '모의고사 기출') {
      if (mockGrade) filtered = filtered.filter(p => p.mockGrade === mockGrade);
      if (mockYear) filtered = filtered.filter(p => p.mockYear === mockYear);
      if (mockMonth) filtered = filtered.filter(p => p.mockMonth === mockMonth);
      if (mockSubjectType) filtered = filtered.filter(p => p.subjectType === mockSubjectType);
    }

    if (studentDiff !== '전체') filtered = filtered.filter(p => p.difficulty === studentDiff);

    const mults = filtered.filter(p => p.type === 'multiple').slice(0, multipleCount);
    const subjs = filtered.filter(p => p.type === 'subjective').slice(0, subjectiveCount);
    const combined = [...mults, ...subjs];

    if (combined.length === 0) {
      alert('조건에 맞는 문제가 없습니다. 다른 단원이나 전체 설정을 시도해보세요!');
      return;
    }
    setSolvedProblems(combined);
    setStudentAnswers({});
    setShowResult(false);
    setActiveAssignmentId(null);
    setCurrentSolvingTitle(`${selectedLevel} 자율 맞춤 문제`);
    setStudentSolving(true);
  };

  // 학생 과제풀이 시작
  const startAssignmentTest = (asgId: number, asgTitle: string, asgProblemIds: string[]) => {
    const targetProbs = problems.filter(p => asgProblemIds.includes(p.id));
    if (targetProbs.length === 0) {
      alert('과제에 연결된 문제를 찾을 수 없습니다.');
      return;
    }
    setSolvedProblems(targetProbs);
    setStudentAnswers({});
    setShowResult(false);
    setActiveAssignmentId(asgId);
    setCurrentSolvingTitle(asgTitle);
    setStudentSolving(true);
  };

  // 인쇄 및 파일 다운로드 공통 헬퍼
  const handlePrintWindow = () => {
    window.print();
  };

  const handleDownloadHWP = (title: string, probs: Problem[]) => {
    let hwpContent = `========================================\n`;
    hwpContent += `        ${title} (한글 HWP 텍스트 용)\n`;
    hwpContent += `========================================\n\n`;

    probs.forEach((p, idx) => {
      hwpContent += `[문제 ${idx + 1}] (${p.type === 'multiple' ? '객관식' : '주관식'}, 난이도: ${p.difficulty})\n`;
      hwpContent += `${p.content}\n`;
      if (p.type === 'multiple' && p.options) {
        p.options.forEach((opt, oIdx) => {
          hwpContent += `   ${numIcons[oIdx]} ${opt}\n`;
        });
      }
      hwpContent += `\n[정답] ${p.answer}\n`;
      if (p.explanation) hwpContent += `[해설] ${p.explanation}\n`;
      if (p.youtubeUrl) hwpContent += `[풀이 영상] ${p.youtubeUrl}\n`;
      hwpContent += `----------------------------------------\n\n`;
    });

    const blob = new Blob([hwpContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_시험지.hwp`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 캔버스 필기 엔진
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const getCanvasPos = (canvas: HTMLCanvasElement, e: React.MouseEvent | React.TouchEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleCanvasStart = (probId: string, e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRefs.current[probId];
    if (!canvas) return;
    const pos = getCanvasPos(canvas, e);
    setMousePos(pos);

    if (activeTool === 'pen' || activeTool === 'eraser') {
      const newStroke: Stroke = {
        id: `stroke_${Date.now()}_${Math.random()}`,
        tool: activeTool,
        color: penColor,
        size: activeTool === 'pen' ? penSize : eraserSize,
        points: [pos]
      };
      setCurrentStroke(newStroke);
    } else if (activeTool === 'lasso') {
      if (selectedStrokeIds.length > 0) {
        setIsDraggingSelected(true);
        setDragStartPos(pos);
      } else {
        setLassoPoints([pos]);
        setSelectedStrokeIds([]);
      }
    }
  };

  const handleCanvasMove = (probId: string, e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRefs.current[probId];
    if (!canvas) return;
    const pos = getCanvasPos(canvas, e);
    setMousePos(pos);

    if (currentStroke) {
      setCurrentStroke(prev => (prev ? { ...prev, points: [...prev.points, pos] } : null));
    } else if (activeTool === 'lasso') {
      if (isDraggingSelected && dragStartPos) {
        const dx = pos.x - dragStartPos.x;
        const dy = pos.y - dragStartPos.y;
        setDragStartPos(pos);
        setCanvasStrokes(prev => {
          const current = prev[probId] || [];
          const updated = current.map(st => {
            if (selectedStrokeIds.includes(st.id)) {
              return {
                ...st,
                points: st.points.map(pt => ({ x: pt.x + dx, y: pt.y + dy }))
              };
            }
            return st;
          });
          return { ...prev, [probId]: updated };
        });
      } else if (lassoPoints.length > 0) {
        setLassoPoints(prev => [...prev, pos]);
      }
    }
  };

  const handleCanvasEnd = (probId: string) => {
    if (currentStroke) {
      setCanvasStrokes(prev => ({
        ...prev,
        [probId]: [...(prev[probId] || []), currentStroke]
      }));
      setCurrentStroke(null);
    }
    if (activeTool === 'lasso') {
      if (isDraggingSelected) {
        setIsDraggingSelected(false);
        setDragStartPos(null);
      } else if (lassoPoints.length > 2) {
        const probStrokes = canvasStrokes[probId] || [];
        const selected = probStrokes
          .filter(st => st.points.some(pt => isPointInPolygon(pt, lassoPoints)))
          .map(st => st.id);
        setSelectedStrokeIds(selected);
        setLassoPoints([]);
      }
    }
  };

  const redrawCanvas = (probId: string) => {
    const canvas = canvasRefs.current[probId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const strokes = canvasStrokes[probId] || [];
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

    allStrokes.forEach(st => {
      if (st.points.length <= 1) return;
      ctx.beginPath();
      ctx.moveTo(st.points[0].x, st.points[0].y);
      for (let i = 1; i < st.points.length; i++) {
        ctx.lineTo(st.points[i].x, st.points[i].y);
      }
      if (st.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = st.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = st.color;
        ctx.lineWidth = st.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (selectedStrokeIds.includes(st.id)) {
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 12;
          ctx.strokeStyle = '#60a5fa';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
    });

    if (lassoPoints.length > 1) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
      for (let i = 1; i < lassoPoints.length; i++) {
        ctx.lineTo(lassoPoints[i].x, lassoPoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (activeTool === 'eraser' && mousePos) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, eraserSize / 2.0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fill();
      ctx.stroke();
    }
  };

  useEffect(() => {
    Object.keys(canvasRefs.current).forEach(id => redrawCanvas(id));
  }, [canvasStrokes, currentStroke, lassoPoints, selectedStrokeIds, activeTool, mousePos, penSize, eraserSize]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans print:bg-white print:text-black">
      {/* PWA 설치 배너 */}
      {showInstallBanner && (
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white px-4 py-3 shadow-xl flex items-center justify-between z-50 relative border-b border-indigo-500 print:hidden">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-yellow-300 animate-bounce" />
            <span className="text-xs md:text-sm font-bold">
              태블릿/핸드폰 바탕화면에 앱 아이콘을 생성하시겠습니까?
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallApp}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>설치 승인</span>
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-300 hover:text-white text-xs px-2 py-1"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              유캔&청운수학스마트문제은행
            </h1>
            <p className="text-xs text-indigo-400 font-medium">
              2022 개정 교육과정 전체 과목 탑재 오토 풀이 맞춤 시스템
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 ml-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="bg-slate-950 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveTitle} className="p-1 text-emerald-400 hover:bg-slate-700 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-200">{examTitle}</span>
                <button
                  onClick={() => { setTempTitle(examTitle); setIsEditingTitle(true); }}
                  className="p-1 text-slate-400 hover:text-indigo-400"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 선생님/학생 모드 스위치 */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              setRoleMode('teacher');
              setStudentSolving(false);
            }}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              roleMode === 'teacher' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>선생님 (문제/과제 제작)</span>
          </button>
          <button
            onClick={() => setRoleMode('student')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              roleMode === 'student' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>학생(스마트 문제풀이)</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 print:p-0 print:max-w-none">
        {/* 비밀번호 변경 모달 */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-400" /> 교사 비밀번호 변경
                </h3>
                <button onClick={() => setShowPasswordChangeModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <p className="text-xs text-slate-400">보안을 위해 기존 비밀번호 입력 후 새로운 비밀번호를 설정하세요.</p>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">기존 비밀번호</label>
                  <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">새 비밀번호</label>
                  <input
                    type="password"
                    placeholder="새 비밀번호 입력"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  비밀번호 저장
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 문제 수정 모달 */}
        {editingProblem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl w-full space-y-4 shadow-2xl my-8">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-400" /> 문제 수정하기
                </h3>
                <button onClick={() => setEditingProblem(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateProblem} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 block">교육과정 단원 정보 수정</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {editingProblem.level === '고등부' ? '과목명' : '학년'}
                      </label>
                      <select
                        value={editingProblem.step1 || ''}
                        onChange={(e) => setEditingProblem({ ...editingProblem, step1: e.target.value, step2: '', step3: '', step4: '' })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="">-- 전체 --</option>
                        {Object.keys(curriculumData[editingProblem.level] || {}).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {editingProblem.level === '고등부' ? '대단원' : '학기'}
                      </label>
                      <select
                        value={editingProblem.step2 || ''}
                        onChange={(e) => setEditingProblem({ ...editingProblem, step2: e.target.value, step3: '', step4: '' })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="">-- 전체 --</option>
                        {(editingProblem.step1 ? Object.keys(curriculumData[editingProblem.level]?.[editingProblem.step1] || {}) : []).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {editingProblem.level === '고등부' ? '중단원' : '대단원'}
                      </label>
                      <select
                        value={editingProblem.step3 || ''}
                        onChange={(e) => setEditingProblem({ ...editingProblem, step3: e.target.value, step4: '' })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="">-- 전체 --</option>
                        {(() => {
                          if (!editingProblem.step1 || !editingProblem.step2) return [];
                          const target = curriculumData[editingProblem.level]?.[editingProblem.step1]?.[editingProblem.step2];
                          return Array.isArray(target) ? target : Object.keys(target || {});
                        })().map((opt: any) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">소단원</label>
                      <select
                        value={editingProblem.step4 || ''}
                        onChange={(e) => setEditingProblem({ ...editingProblem, step4: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="">-- 전체 --</option>
                        {(() => {
                          if (!editingProblem.step1 || !editingProblem.step2 || !editingProblem.step3) return [];
                          const target = curriculumData[editingProblem.level]?.[editingProblem.step1]?.[editingProblem.step2]?.[editingProblem.step3];
                          return Array.isArray(target) ? target : [];
                        })().map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">문제 제목</label>
                    <input
                      type="text"
                      value={editingProblem.title}
                      onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">난이도</label>
                    <select
                      value={editingProblem.difficulty}
                      onChange={(e) => setEditingProblem({ ...editingProblem, difficulty: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      <option value="하">하</option>
                      <option value="중">중</option>
                      <option value="상">상</option>
                      <option value="최상">최상</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">문제 지문 (텍스트)</label>
                  <textarea
                    rows={4}
                    value={editingProblem.content}
                    onChange={(e) => setEditingProblem({ ...editingProblem, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
                  />
                </div>

                {editingProblem.type === 'multiple' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">객관식 보기 (1번~5번)</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs text-indigo-400 font-bold w-4">{numIcons[idx]}</span>
                          <input
                            type="text"
                            value={editingProblem.options[idx] || ''}
                            onChange={(e) => {
                              const newOpts = [...editingProblem.options];
                              newOpts[idx] = e.target.value;
                              setEditingProblem({ ...editingProblem, options: newOpts });
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">정답</label>
                    <input
                      type="text"
                      value={editingProblem.answer}
                      onChange={(e) => setEditingProblem({ ...editingProblem, answer: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">유튜브 풀이 URL</label>
                    <input
                      type="text"
                      value={editingProblem.youtubeUrl || ''}
                      onChange={(e) => setEditingProblem({ ...editingProblem, youtubeUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">상세 해설</label>
                  <textarea
                    rows={3}
                    value={editingProblem.explanation}
                    onChange={(e) => setEditingProblem({ ...editingProblem, explanation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingProblem(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
                  >
                    수정 내용 저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 교사 모드 */}
        {roleMode === 'teacher' && (
          !isTeacherAuthenticated ? (
            /* 교사 보안 비밀번호 입력폼 */
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md mx-auto space-y-6 my-16">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-inner">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white">교사용 관리자 보안 인증</h2>
                <p className="text-xs text-slate-400">교사 전용 메뉴 접속을 위해 보안 비밀번호를 입력하세요.</p>
              </div>
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="교사용 비밀번호 입력 (초기: 1234)"
                  value={inputTeacherPassword}
                  onChange={(e) => setInputTeacherPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {teacherPassError && <p className="text-xs text-rose-400 font-medium text-center">{teacherPassError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  교사 권한 인증 및 접속
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* 교사용 상단 메뉴 탭 */}
              <div className="mb-6 bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 print:hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 flex-1">
                  <button
                    onClick={() => setViewMode('dashboard')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'dashboard' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>문제 은행 ({problems.length})</span>
                  </button>
                  <button
                    onClick={() => setViewMode('generate_exam')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'generate_exam' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>자율 맞춤 출제</span>
                  </button>
                  <button
                    onClick={() => setViewMode('saved_exams')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'saved_exams' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>출제 보관함 ({savedExams.length})</span>
                  </button>
                  <button
                    onClick={() => setViewMode('register_manual')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'register_manual' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>수동 문제 제작</span>
                  </button>
                  <button
                    onClick={() => setViewMode('assignment_manage')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'assignment_manage' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>학생 과제 대시보드</span>
                  </button>
                  <button
                    onClick={() => setViewMode('register_ai')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'register_ai' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI 캡처 추출</span>
                  </button>
                  <button
                    onClick={() => setViewMode('print')}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold border ${
                      viewMode === 'print' ? 'bg-indigo-600 text-white border-indigo-500 shadow' : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>시험지 인쇄 (PDF/HWP)</span>
                  </button>
                  <button
                    onClick={() => setShowPasswordChangeModal(true)}
                    className="flex items-center justify-center space-x-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>비밀번호 변경</span>
                  </button>
                </div>
              </div>

              {/* 교육과정 선택 필터 영역 */}
              {viewMode !== 'print' && (
                <div className="mb-8 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 print:hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                      <Layers className="w-4 h-4" />
                      <span>2022 개정 교육과정 전체 체계</span>
                    </div>
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                      {['초등부', '중등부', '고등부', '모의고사 기출'].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLevel(level);
                            setStep1(''); setStep2(''); setStep3(''); setStep4('');
                            setMockGrade(''); setMockYear(''); setMockMonth(''); setMockSubjectType('');
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            selectedLevel === level
                              ? level === '모의고사 기출'
                                ? 'bg-rose-600 text-white'
                                : 'bg-indigo-600 text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedLevel !== '모의고사 기출' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {selectedLevel === '고등부' ? '과목명' : '학년'}
                        </label>
                        <select
                          value={step1}
                          onChange={(e) => { setStep1(e.target.value); setStep2(''); setStep3(''); setStep4(''); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs"
                        >
                          <option value="">-- 전체 --</option>
                          {step1Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {selectedLevel === '고등부' ? '대단원' : '학기'}
                        </label>
                        <select
                          value={step2}
                          disabled={!step1}
                          onChange={(e) => { setStep2(e.target.value); setStep3(''); setStep4(''); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs disabled:opacity-40"
                        >
                          <option value="">-- 전체 --</option>
                          {step2Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {selectedLevel === '고등부' ? '중단원' : '대단원'}
                        </label>
                        <select
                          value={step3}
                          disabled={!step2}
                          onChange={(e) => { setStep3(e.target.value); setStep4(''); }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs disabled:opacity-40"
                        >
                          <option value="">-- 전체 --</option>
                          {step3Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">소단원</label>
                        <select
                          value={step4}
                          disabled={!step3 || step4Options.length === 0}
                          onChange={(e) => setStep4(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs disabled:opacity-40"
                        >
                          <option value="">-- 전체 --</option>
                          {step4Options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-rose-950/20 p-4 rounded-xl border border-rose-900/40">
                      <div>
                        <label className="block text-xs text-rose-300 font-bold mb-1">1. 학년 선택</label>
                        <select
                          value={mockGrade}
                          onChange={(e) => {
                            setMockGrade(e.target.value);
                            setStep1(e.target.value);
                            setStep2(''); setStep3(''); setMockSubjectType('');
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="">-- 학년 전체 --</option>
                          {MOCK_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-rose-300 font-bold mb-1">2. 기출 연도</label>
                        <select
                          value={mockYear}
                          onChange={(e) => setMockYear(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="">-- 연도 전체 --</option>
                          {EXAM_YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-rose-300 font-bold mb-1">3. 기출 월 선택</label>
                        <select
                          value={mockMonth}
                          disabled={!mockGrade}
                          onChange={(e) => {
                            setMockMonth(e.target.value);
                            setStep2(e.target.value);
                            setStep3(''); setMockSubjectType('');
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white disabled:opacity-40"
                        >
                          <option value="">-- 월 전체 --</option>
                          {mockGrade && curriculumData['모의고사 기출']?.[mockGrade] ? (
                            Object.keys(curriculumData['모의고사 기출'][mockGrade]).map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))
                          ) : (
                            EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-rose-300 font-bold mb-1">4. 공통/선택 구분</label>
                        <select
                          value={mockSubjectType}
                          disabled={!mockGrade || !mockMonth}
                          onChange={(e) => {
                            const val = e.target.value as '공통과목' | '선택과목' | '';
                            setMockSubjectType(val);
                            setStep3('');
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white disabled:opacity-40"
                        >
                          <option value="">-- 전체 --</option>
                          {mockGrade && mockMonth && curriculumData['모의고사 기출']?.[mockGrade]?.[mockMonth] ? (
                            Object.keys(curriculumData['모의고사 기출'][mockGrade][mockMonth]).map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))
                          ) : null}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-rose-300 font-bold mb-1">5. 과목 선택</label>
                        <select
                          value={step3}
                          disabled={!mockGrade || !mockMonth}
                          onChange={(e) => setStep3(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white disabled:opacity-40"
                        >
                          <option value="">-- 과목 전체 --</option>
                          {mockGrade && mockMonth && curriculumData['모의고사 기출']?.[mockGrade]?.[mockMonth] ? (
                            mockSubjectType ? (
                              (curriculumData['모의고사 기출'][mockGrade][mockMonth][mockSubjectType] || []).map((sub: string) => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))
                            ) : (
                              Object.values(curriculumData['모의고사 기출'][mockGrade][mockMonth]).flat().map((sub: any) => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))
                            )
                          ) : null}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 뷰 1: 등록 문제 대시보드 */}
              {viewMode === 'dashboard' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>등록된 문제 목록 ({problems.length}) - 브라우저에 영구 저장됨</span>
                  </h2>
                  <div className="grid gap-4">
                    {problems.map((prob) => (
                      <div key={prob.id} className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            {prob.level === '모의고사 기출' ? (
                              <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-md flex items-center gap-1">
                                <FileQuestion className="w-3.5 h-3.5" />
                                [{prob.mockGrade || prob.step1}] [{prob.mockYear}] [{prob.mockMonth || prob.step2}] {prob.subjectType && `[${prob.subjectType}]`} (난이도: {prob.difficulty})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-md">
                                {prob.level} &gt; {prob.step1} {prob.step2 && `> ${prob.step2}`} (난이도: {prob.difficulty})
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                              prob.type === 'subjective'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {prob.type === 'subjective' ? '주관식' : '객관식'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProblem(prob)}
                              className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                              title="문제 수정"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('정말 이 문제를 삭제하시겠습니까?')) {
                                  setProblems(problems.filter(p => p.id !== prob.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="문제 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-base font-bold pt-3">{prob.title}</h3>
                        {prob.contentImage ? (
                          <div className="mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                            <img src={prob.contentImage} alt="문제지문" className="max-h-96 rounded object-contain" />
                          </div>
                        ) : (
                          <div className="mt-3 p-4 bg-slate-950 text-slate-200 whitespace-pre-wrap text-sm rounded-xl border border-slate-800">
                            {prob.content}
                          </div>
                        )}
                        {prob.type === 'multiple' && prob.options && prob.options.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                            {prob.options.map((opt, i) => (
                              <div key={i} className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/50 text-slate-400">
                                {numIcons[i]} {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-emerald-400">[정답]:</span>
                            <span className="text-slate-200">{prob.answer || '미지정'}</span>
                          </div>
                          {prob.explanationImage ? (
                            <div className="pt-2">
                              <span className="font-bold text-slate-300 block mb-1">[해설 이미지]:</span>
                              <img src={prob.explanationImage} alt="해설" className="max-h-60 rounded border border-slate-800" />
                            </div>
                          ) : prob.explanation ? (
                            <div className="text-slate-400">
                              <span className="font-bold text-slate-300">[해설]:</span> {prob.explanation}
                            </div>
                          ) : null}
                          {prob.youtubeUrl && (
                            <div className="flex items-center space-x-2 text-red-400 pt-1">
                              <Video className="w-4 h-4" />
                              <a href={prob.youtubeUrl} target="_blank" rel="noreferrer" className="underline hover:text-red-300">
                                {prob.youtubeUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 뷰 2: 수동 문제 직접 제작 */}
              {viewMode === 'register_manual' && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <h2 className="text-base font-bold text-white mb-6 flex items-center space-x-2">
                    <Edit3 className="w-5 h-5 text-indigo-400" />
                    <span>수동 문제 제작 (객관식/주관식 분리 & 캡처 붙여넣기 통합)</span>
                  </h2>
                  <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="flex gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800 items-center">
                      <span className="text-xs font-bold text-slate-400">문제 유형 선택:</span>
                      <button
                        type="button"
                        onClick={() => setManualType('multiple')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          manualType === 'multiple' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        객관식(지문+보기 통합 캡처)
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualType('subjective')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          manualType === 'subjective' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        주관식(단답형/서술형)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">문제 제목 / 출처</label>
                        <input
                          type="text"
                          placeholder="예) 2025학년도 6월 모평 수학 22번"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">난이도</label>
                        <select
                          value={manualDifficulty}
                          onChange={(e) => setManualDifficulty(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        >
                          <option value="하">하</option>
                          <option value="중">중</option>
                          <option value="상">상</option>
                          <option value="최상">최상</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-indigo-300">
                        {manualType === 'multiple' ? '객관식 문제 입력 (지문 보기 통합 캡처 후 Ctrl+V)' : '주관식 문제 입력 (지문 캡처 후 Ctrl+V)'}
                      </label>
                      <div
                        tabIndex={0}
                        onPaste={async (e) => {
                          const img = await readPastedImage(e);
                          if (img) setManualContentImage(img);
                        }}
                        className="p-4 bg-slate-950 rounded-xl border-2 border-dashed border-indigo-500/40 focus:outline-none focus:border-indigo-400 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>텍스트 입력 또는 이 영역을 클릭 후 <strong className="text-indigo-400">Ctrl + V</strong>로 이미지를 붙여넣으세요.</span>
                          {manualContentImage && (
                            <button
                              type="button"
                              onClick={() => setManualContentImage('')}
                              className="text-xs text-red-400 hover:underline"
                            >
                              캡처 이미지 삭제
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          placeholder={manualType === 'multiple' ? "문제 지문과 보기를 텍스트로 입력하거나 영역에 바로 캡처 붙여넣기 해주세요." : "주관식 문제를 입력하거나 바로 캡처 붙여넣기 해주세요."}
                          value={manualContent}
                          onChange={(e) => setManualContent(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white"
                        />
                        {manualContentImage && (
                          <div className="pt-2 border-t border-slate-800">
                            <p className="text-[11px] text-emerald-400 font-bold mb-1">붙여넣은 문제 이미지:</p>
                            <img src={manualContentImage} alt="문제 캡처" className="max-h-60 rounded border border-slate-700" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                      <span className="text-xs font-bold text-emerald-400 block">답지, 상세 풀이 해설 및 풀이 영상</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={manualType === 'multiple' ? "정답 (예: ① 또는 1)" : "정답 수치/단답 (예: 9)"}
                          value={manualAnswer}
                          onChange={(e) => setManualAnswer(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="유튜브 문제풀이 URL 입력 (예: https://youtube.com/...)"
                          value={manualYoutubeUrl}
                          onChange={(e) => setManualYoutubeUrl(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div
                        tabIndex={0}
                        onPaste={async (e) => {
                          const img = await readPastedImage(e);
                          if (img) setManualExplanationImage(img);
                        }}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 focus:outline-none focus:border-indigo-500"
                      >
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>상세 풀이 해설 작성 (이 영역 클릭 후 <strong className="text-indigo-400">Ctrl + V</strong>로 해설 이미지 붙여넣기 가능)</span>
                          {manualExplanationImage && (
                            <button
                              type="button"
                              onClick={() => setManualExplanationImage('')}
                              className="text-xs text-red-400 hover:underline"
                            >
                              해설 이미지 삭제
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          placeholder="상세 풀이 해설을 텍스트로 작성하거나 이미지를 캡처하여 붙여넣으세요."
                          value={manualExplanation}
                          onChange={(e) => setManualExplanation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        />
                        {manualExplanationImage && (
                          <div className="pt-1">
                            <img src={manualExplanationImage} alt="해설 캡처" className="max-h-48 rounded border border-slate-700" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl space-y-3">
                      <label className="flex items-center space-x-2 text-xs font-bold text-indigo-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={directAssign}
                          onChange={(e) => setDirectAssign(e.target.checked)}
                          className="rounded bg-slate-950 border-slate-700"
                        />
                        <span>제작과 동시에 답지/해설/유튜브 링크를 포함하여 학생 과제로 즉시 부과하기</span>
                      </label>
                      {directAssign && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">과제 제출 마감일:</span>
                          <input
                            type="date"
                            value={directAssignDueDate}
                            onChange={(e) => setDirectAssignDueDate(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-white"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>문제 제작 완료 및 저장</span>
                    </button>
                  </form>
                </div>
              )}

              {/* AI 캡처 자동 추출 */}
              {viewMode === 'register_ai' && (
                <div className="p-8 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h2 className="text-base font-bold text-white">Gemini AI 자동 문제 답지 분리 캡처 & 1문항씩 자동 매칭 저장</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        여러 문제가 포함된 화면에서 <span className="text-indigo-400 font-bold">문제 영역</span>과 <span className="text-emerald-400 font-bold">답지 영역</span>을 분리 캡처하여 붙여넣으세요. AI가 문항 번호를 파싱하여 자동으로 1번 문제-1번 답지 매칭을 완성합니다.
                      </p>
                    </div>
                  </div>

                  {isAnalyzing ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-slate-950/60 rounded-xl border border-slate-800">
                      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                      <p className="text-xs font-semibold text-slate-300">
                        Gemini AI가 문제와 답지를 문항별로 분할 인식하여 일치시키는 중입니다...
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        tabIndex={0}
                        onPaste={async (e) => {
                          const img = await readPastedImage(e);
                          if (img) setAiProblemImage(img);
                        }}
                        className="p-6 bg-slate-950/60 border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-xl text-center space-y-3 focus:outline-none focus:border-indigo-400 shadow-xl"
                      >
                        <div className="flex items-center justify-center space-x-2 text-indigo-400 font-bold text-xs">
                          <ImageIcon className="w-5 h-5" />
                          <span>[1단계] 문제 캡처 붙여넣기 (Ctrl+V)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          여러 객관식/주관식 문제가 들어있는 영역을 캡처한 후 클릭하여 <strong className="text-indigo-300">Ctrl+V</strong> 하세요.
                        </p>
                        {aiProblemImage ? (
                          <div className="relative pt-2">
                            <img src={aiProblemImage} alt="문제 캡처" className="max-h-56 mx-auto rounded border border-slate-700" />
                            <button
                              onClick={() => setAiProblemImage('')}
                              className="mt-2 text-xs text-red-400 hover:underline"
                            >
                              이미지 삭제
                            </button>
                          </div>
                        ) : (
                          <div className="py-8 text-slate-600 text-xs">캡처 이미지 대기 중...</div>
                        )}
                      </div>

                      <div
                        tabIndex={0}
                        onPaste={async (e) => {
                          const img = await readPastedImage(e);
                          if (img) setAiAnswerImage(img);
                        }}
                        className="p-6 bg-slate-950/60 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl text-center space-y-3 focus:outline-none focus:border-emerald-400 shadow-xl"
                      >
                        <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>[2단계] 정답/해설 캡쳐 붙여넣기 (Ctrl+V)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          정답 및 상세해설이 들어있는 영역을 캡처한 후 클릭하여 <strong className="text-emerald-300">Ctrl+V</strong> 하세요.
                        </p>
                        {aiAnswerImage ? (
                          <div className="relative pt-2">
                            <img src={aiAnswerImage} alt="답지 캡처" className="max-h-56 mx-auto rounded border border-slate-700" />
                            <button
                              onClick={() => setAiAnswerImage('')}
                              className="mt-2 text-xs text-red-400 hover:underline"
                            >
                              이미지 삭제
                            </button>
                          </div>
                        ) : (
                          <div className="py-8 text-slate-600 text-xs">캡처 이미지 대기 중...</div>
                        )}
                      </div>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <button
                      onClick={processMultiSegmentationAI}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>AI 자동 분석 및 문제 답지 매칭 저장 시작</span>
                    </button>
                  )}
                </div>
              )}

              {/* 교사: 자율 맞춤 시험지 출제 */}
              {viewMode === 'generate_exam' && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                      <span>문제은행 저장 문제 기반 자율 맞춤 시험지 출제</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      상단의 2022 개정 교육과정 필터 및 아래 조건에 맞춰 문제은행에서 맞춤 문제셋을 자동 구성합니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">시험지(문제셋) 제목 설정</label>
                      <input
                        type="text"
                        placeholder={`예) ${currentYear}학년도 대수 중간고사 대비 단원평가`}
                        value={generatedExamTitle}
                        onChange={(e) => setGeneratedExamTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">난이도 조건</label>
                      <select
                        value={teacherDiff}
                        onChange={(e) => setTeacherDiff(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="전체">전체 난이도</option>
                        <option value="하">하</option>
                        <option value="중">중</option>
                        <option value="상">상</option>
                        <option value="최상">최상</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs font-semibold text-slate-300">객관식 지정 문항 수</span>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={teacherMultCount}
                        onChange={(e) => setTeacherMultCount(Number(e.target.value))}
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-right text-emerald-400 font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs font-semibold text-slate-300">주관식 지정 문항 수</span>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={teacherSubjCount}
                        onChange={(e) => setTeacherSubjCount(Number(e.target.value))}
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-right text-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateTeacherExam}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>맞춤 시험지 추출 및 사전 구성</span>
                  </button>

                  {currentGeneratedExam.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          추출된 맞춤 문제 ({currentGeneratedExam.length}문항)
                        </h3>
                        <button
                          onClick={handleSaveGeneratedExam}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow"
                        >
                          <FolderKanban className="w-4 h-4" />
                          <span>이 시험지를 출제 보관함에 저장하기</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {currentGeneratedExam.map((p, idx) => (
                          <div key={p.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold text-slate-200">[{idx + 1}] {p.title}</span>
                              <span className="text-slate-400">({p.type === 'subjective' ? '주관식' : '객관식'}) (난이도: {p.difficulty})</span>
                            </div>
                            {p.contentImage ? (
                              <img src={p.contentImage} alt="문제" className="max-h-48 rounded" />
                            ) : (
                              <p className="text-xs text-slate-300 whitespace-pre-wrap">{p.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 교사: 출제 보관함 및 과제 대상 개별 지정 */}
              {viewMode === 'saved_exams' && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                      <FolderKanban className="w-5 h-5 text-indigo-400" />
                      <span>저장된 맞춤 시험지 보관함 & 개별 학생 과제 부과</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      자율 출제로 구성한 시험지를 보관하고, 특정 학생이나 전체 학생을 선택하여 마감일과 함께 과제로 즉시 전송합니다.
                    </p>
                  </div>

                  {savedExams.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      보관함에 저장된 시험지가 없습니다. &apos;자율 맞춤 시험지 출제&apos; 메뉴에서 새로운 시험지를 저장해보세요!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {savedExams.map((exam) => (
                        <div key={exam.id} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700 mr-2">
                                {exam.targetLevel}
                              </span>
                              <span className="text-sm font-bold text-white">{exam.title}</span>
                              <span className="text-xs text-slate-500 ml-2">({exam.createdAt} 생성)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-emerald-400 font-semibold">{exam.problems.length}개 문항</span>
                              <button
                                onClick={() => {
                                  setSelectedExamToPrint(exam);
                                  setViewMode('print');
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs rounded border border-slate-700 flex items-center gap-1"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>인쇄하기</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSavedExam(exam.id, exam.title)}
                                className="p-1 text-slate-500 hover:text-red-400"
                                title="시험지 삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {exam.problems.map((prob, idx) => (
                              <div key={prob.id} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-slate-300">
                                <span className="font-bold text-indigo-400">{idx + 1}.</span> {prob.title}
                              </div>
                            ))}
                          </div>

                          {/* 과제 부여 학생 지정 섹션 */}
                          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-xs font-bold text-slate-300 block">과제 부여 대상 학생 선택 (선택 안함 시 전체 부여):</span>
                            <div className="flex flex-wrap gap-3">
                              {allowedStudents.map(st => {
                                const selectedList = assignTargetStudentsMap[exam.id] || [];
                                const isChecked = selectedList.includes(st.id);
                                return (
                                  <label key={st.id} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const currentMap = assignTargetStudentsMap[exam.id] || [];
                                        let updated: number[];
                                        if (e.target.checked) {
                                          updated = [...currentMap, st.id];
                                        } else {
                                          updated = currentMap.filter(id => id !== st.id);
                                        }
                                        setAssignTargetStudentsMap({
                                          ...assignTargetStudentsMap,
                                          [exam.id]: updated
                                        });
                                      }}
                                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                                    />
                                    <span>{st.name} ({st.phone.slice(-4)})</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">과제 마감일:</span>
                              <input
                                type="date"
                                value={assignDueDateMap[exam.id] || ''}
                                onChange={(e) => setAssignDueDateMap({ ...assignDueDateMap, [exam.id]: e.target.value })}
                                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              />
                            </div>
                            <button
                              onClick={() => handleAssignExamToStudents(exam)}
                              className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 shadow"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>학생 과제로 부과하기</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 교사: 학생 인가 및 과제 대시보드 */}
              {viewMode === 'assignment_manage' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 학생 승인 및 관리 */}
                  <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" /> 학생 인가 등록 (비밀번호 지정 & 퇴원 승인 취소)
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="학생 이름 (예: 김철수)"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="전체 전화번호 (예: 01012345678)"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={handleAddStudent}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                      >
                        학생 승인 추가
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800 divide-y divide-slate-800 text-xs">
                      {allowedStudents.map(st => (
                        <div key={st.id} className="py-2.5 flex justify-between items-center text-slate-300">
                          <div>
                            <span className="font-bold text-white mr-2">{st.name}</span>
                            <span className="text-slate-500">{st.phone} (PW: {st.phone.slice(-4)})</span>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(st.id, st.name)}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded flex items-center gap-1 text-[11px] font-semibold transition-colors"
                            title="퇴원 처리 및 승인 취소"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>퇴원(취소)</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 과제 관리 및 실시간 제출 현황 */}
                  <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-400" /> 과제 부과 & 실시간 제출 현황 & 마감기간 수정
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                      {assignments.map(asg => (
                        <div key={asg.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white text-sm">{asg.title}</h4>
                              <p className="text-slate-400 text-[11px] mt-0.5">
                                대상: {asg.targetStudents && asg.targetStudents.length > 0 ? `${asg.targetStudents.length}명 선택 지정` : '전체 학생'} | 문항 수: {asg.problemIds.length}개
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                              className="text-slate-500 hover:text-red-400 p-1"
                              title="과제 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400">마감 기한:</span>
                            <input
                              type="date"
                              value={asg.dueDate}
                              onChange={(e) => handleUpdateAssignmentDueDate(asg.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="font-bold text-indigo-300 block">학생 제출 및 채점 결과:</span>
                            {allowedStudents.map(st => {
                              const subKey = `${asg.id}_${st.name}`;
                              const subRecord = submissions[subKey];
                              return (
                                <div key={st.id} className="flex justify-between items-center bg-slate-900/50 px-2.5 py-1.5 rounded text-[11px]">
                                  <span>{st.name}</span>
                                  {subRecord ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-emerald-400 font-bold">{subRecord.score}점</span>
                                      <span className="text-slate-500">({subRecord.submittedAt})</span>
                                      <button
                                        onClick={() => {
                                          const asgProbs = problems.filter(p => asg.problemIds.includes(p.id));
                                          setViewingSubmission({
                                            studentName: st.name,
                                            assignmentTitle: asg.title,
                                            record: subRecord,
                                            problems: asgProbs
                                          });
                                        }}
                                        className="text-indigo-400 hover:underline flex items-center gap-0.5"
                                      >
                                        <Eye className="w-3 h-3" /> 상세
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-rose-400 font-medium">미제출</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 교사 인쇄 전용 뷰 (Saved Exams & 문제 은행 통합 인쇄) */}
              {viewMode === 'print' && (
                <div className="bg-white text-black p-8 rounded-2xl shadow-2xl space-y-6 print:p-0">
                  <div className="flex justify-between items-center border-b border-gray-300 pb-4 print:hidden">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Printer className="w-6 h-6 text-indigo-600" /> 시험지 인쇄 / PDF 저장 / 한글 파일 다운로드
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">
                        출제 보관함에 저장된 시험지를 선택하여 바로 출력할 수 있습니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                            setSelectedExamToPrint(null);
                          } else {
                            const found = savedExams.find(ex => ex.id === val);
                            setSelectedExamToPrint(found || null);
                          }
                        }}
                        className="bg-gray-100 border border-gray-300 text-xs font-bold text-gray-800 rounded px-3 py-2"
                      >
                        <option value="">-- [기본] 문제 은행 전체/필터 문제 인쇄 --</option>
                        {savedExams.map(ex => (
                          <option key={ex.id} value={ex.id}>
                            [보관함] {ex.title} ({ex.problems.length}문항)
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          const probsToPrint = selectedExamToPrint ? selectedExamToPrint.problems : problems;
                          const titleToPrint = selectedExamToPrint ? selectedExamToPrint.title : examTitle;
                          handleDownloadHWP(titleToPrint, probsToPrint);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>HWP 다운로드</span>
                      </button>

                      <button
                        onClick={handlePrintWindow}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow"
                      >
                        <Printer className="w-4 h-4" />
                        <span>PDF / 인쇄하기</span>
                      </button>
                    </div>
                  </div>

                  {/* 인쇄될 본문 미리보기 및 출력 영억 */}
                  <div className="print-area space-y-6">
                    <div className="text-center border-b-2 border-black pb-4">
                      <h1 className="text-2xl font-black">{selectedExamToPrint ? selectedExamToPrint.title : examTitle}</h1>
                      <div className="flex justify-between items-center text-xs mt-3 px-2 font-bold">
                        <span>과목/단원: {selectedExamToPrint ? selectedExamToPrint.targetLevel : `${selectedLevel} ${step1}`}</span>
                        <span>성명: ____________________</span>
                        <span>점수: ____________ / 100점</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
                      {(selectedExamToPrint ? selectedExamToPrint.problems : problems).map((p, idx) => (
                        <div key={p.id} className="border-b border-gray-200 pb-4 space-y-2 break-inside-avoid">
                          <div className="font-bold text-sm flex justify-between">
                            <span>[{idx + 1}] {p.title}</span>
                            <span className="text-xs text-gray-500">({p.type === 'multiple' ? '객관식' : '주관식'}, 난이도:{p.difficulty})</span>
                          </div>
                          {p.contentImage ? (
                            <img src={p.contentImage} alt="문제지문" className="max-h-48 my-2" />
                          ) : (
                            <p className="text-xs whitespace-pre-wrap leading-relaxed">{p.content}</p>
                          )}
                          {p.type === 'multiple' && p.options && (
                            <div className="grid grid-cols-1 gap-1 text-xs pt-1">
                              {p.options.map((opt, i) => (
                                <div key={i}>{numIcons[i]} {opt}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* 학생 모드 */}
        {roleMode === 'student' && (
          !isAuthenticated ? (
            /* 학생 로그인 폼 */
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md mx-auto space-y-6 my-16">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white">학생 스마트 학습 접속</h2>
                <p className="text-xs text-slate-400">선생님에게 승인받은 이름과 전화번호 뒤 4자리를 입력하세요.</p>
              </div>
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <input
                  type="text"
                  placeholder="학생 이름 (예: 김철수)"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="password"
                  placeholder="전화번호 뒤 4자리 (예: 5678)"
                  value={loginPhoneLast4}
                  onChange={(e) => setLoginPhoneLast4(e.target.value)}
                  required
                  maxLength={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                {loginError && <p className="text-xs text-rose-400 font-medium text-center">{loginError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  학생 접속 승인
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* 학생 메인 탭 및 인쇄 기능 */}
              <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 print:hidden">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">접속한 학생:</span>
                  <span className="text-sm font-bold text-emerald-400">{currentStudent?.name} 학생</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setStudentTab('practice'); setStudentSolving(false); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      studentTab === 'practice' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    자율 맞춤 문제 풀이
                  </button>
                  <button
                    onClick={() => { setStudentTab('assignment'); setStudentSolving(false); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      studentTab === 'assignment' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    부여된 과제 목록
                  </button>
                  <button
                    onClick={() => { setStudentTab('history'); setStudentSolving(false); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      studentTab === 'history' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    지난 제출 & 오답 복습
                  </button>
                </div>
              </div>

              {/* 탭 1: 자율 맞춤 문제 풀이 설정 */}
              {studentTab === 'practice' && !studentSolving && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>자율 맞춤 문제 추출 설정</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">난이도 설정</label>
                      <select
                        value={studentDiff}
                        onChange={(e) => setStudentDiff(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="전체">전체 난이도</option>
                        <option value="하">하</option>
                        <option value="중">중</option>
                        <option value="상">상</option>
                        <option value="최상">최상</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">객관식 문항 수</label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={multipleCount}
                        onChange={(e) => setMultipleCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">주관식 문항 수</label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={subjectiveCount}
                        onChange={(e) => setSubjectiveCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={startStudentTest}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>자율 맞춤 문제 생성 및 풀이 시작</span>
                  </button>
                </div>
              )}

              {/* 탭 2: 부여된 과제 목록 */}
              {studentTab === 'assignment' && !studentSolving && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-emerald-400" />
                    <span>선생님이 부과한 과제 목록</span>
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {assignments
                      .filter(asg => {
                        if (!asg.targetStudents || asg.targetStudents.length === 0) return true;
                        const me = allowedStudents.find(s => s.name === currentStudent?.name);
                        return me ? asg.targetStudents.includes(me.id) : true;
                      })
                      .map(asg => {
                        const subKey = `${asg.id}_${currentStudent?.name}`;
                        const isSubmitted = !!submissions[subKey];
                        return (
                          <div key={asg.id} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                                  {asg.targetLevel}
                                </span>
                                <h3 className="text-base font-bold text-white">{asg.title}</h3>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                마감기한: {asg.dueDate} | 문항 수: {asg.problemIds.length}문항
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSubmitted ? (
                                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
                                  제출 완료 ({submissions[subKey].score}점)
                                </span>
                              ) : (
                                <button
                                  onClick={() => startAssignmentTest(asg.id, asg.title, asg.problemIds)}
                                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                                >
                                  <PenTool className="w-4 h-4" />
                                  <span>과제 풀기 시작</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 탭 3: 지난 제출 목록 & 오답 노트 복습 */}
              {studentTab === 'history' && !studentSolving && (
                <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
                  <h2 className="text-base font-bold text-white flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-emerald-400" />
                    <span>지난 과제 제출 및 오답 복습 공간</span>
                  </h2>

                  {selectedHistoryRecord ? (
                    <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">{selectedHistoryRecord.examTitle}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            제출일시: {selectedHistoryRecord.submittedAt} | 점수: <span className="text-emerald-400 font-bold">{selectedHistoryRecord.score}점</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadHWP(selectedHistoryRecord.examTitle || '오답노트', selectedHistoryRecord.problems || [])}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <FileDown className="w-3.5 h-3.5" /> HWP 저장
                          </button>
                          <button
                            onClick={handlePrintWindow}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" /> 인쇄/PDF
                          </button>
                          <button
                            onClick={() => setSelectedHistoryRecord(null)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                          >
                            목록으로
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {(selectedHistoryRecord.problems || []).map((prob, idx) => {
                          const myAns = selectedHistoryRecord.answers[prob.id] || '미제출';
                          const isCorrect = myAns.trim().toLowerCase() === (prob.answer || '').trim().toLowerCase();

                          return (
                            <div key={prob.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/10 border-rose-900/40'}`}>
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-sm text-white">
                                  [{idx + 1}] {prob.title}
                                </span>
                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                  {isCorrect ? '정답' : '오답'}
                                </span>
                              </div>

                              {prob.contentImage ? (
                                <img src={prob.contentImage} alt="문제지문" className="max-h-60 rounded mb-3" />
                              ) : (
                                <p className="text-xs text-slate-300 whitespace-pre-wrap mb-3">{prob.content}</p>
                              )}

                              {prob.type === 'multiple' && prob.options && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs mb-4">
                                  {prob.options.map((opt, i) => (
                                    <div key={i} className="p-2 bg-slate-950/60 rounded border border-slate-800 text-slate-400">
                                      {numIcons[i]} {opt}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                                <div className="flex gap-4">
                                  <span>제출한 답: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{myAns}</strong></span>
                                  <span>실제 정답: <strong className="text-emerald-400">{prob.answer}</strong></span>
                                </div>
                                {prob.explanation && (
                                  <div className="text-slate-400 pt-1">
                                    <span className="font-bold text-slate-300">[해설]:</span> {prob.explanation}
                                  </div>
                                )}
                                {prob.explanationImage && (
                                  <img src={prob.explanationImage} alt="해설이미지" className="max-h-48 rounded pt-2" />
                                )}
                                {prob.youtubeUrl && (
                                  <div className="pt-2 flex items-center gap-1 text-red-400">
                                    <Video className="w-4 h-4" />
                                    <a href={prob.youtubeUrl} target="_blank" rel="noreferrer" className="underline">
                                      유튜브 해설 강의 바로가기
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(submissions)
                        .filter(([key]) => key.includes(currentStudent?.name || ''))
                        .map(([key, record]) => (
                          <div key={key} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-white text-base">{record.examTitle || '자율 제출 시험지'}</h3>
                              <p className="text-xs text-slate-400 mt-1">제출일: {record.submittedAt}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-emerald-400 font-bold text-sm">{record.score}점</span>
                              <button
                                onClick={() => setSelectedHistoryRecord(record)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>오답/해설 보기</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* 학생 문제 풀이 캔버스 화면 */}
              {studentSolving && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 print:hidden">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-emerald-400" />
                      <span>{currentSolvingTitle} 스마트 풀이</span>
                    </h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadHWP(currentSolvingTitle, solvedProblems)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <FileDown className="w-3.5 h-3.5" /> HWP 인쇄
                      </button>
                      <button
                        onClick={handlePrintWindow}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> PDF 인쇄
                      </button>
                      <button
                        onClick={handleSubmitStudentWork}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg"
                      >
                        최종 답안 제출
                      </button>
                    </div>
                  </div>

                  {/* 캔버스 도구 바 */}
                  <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xl print:hidden">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveTool('pen')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                          activeTool === 'pen' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <PenTool className="w-4 h-4" />
                        <span>펜</span>
                      </button>
                      <button
                        onClick={() => setActiveTool('eraser')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                          activeTool === 'eraser' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Eraser className="w-4 h-4" />
                        <span>지우개</span>
                      </button>
                      <button
                        onClick={() => setActiveTool('lasso')}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                          activeTool === 'lasso' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Lasso className="w-4 h-4" />
                        <span>선택 이동</span>
                      </button>
                    </div>

                    {activeTool === 'pen' && (
                      <div className="flex items-center space-x-3">
                        {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff'].map(c => (
                          <button
                            key={c}
                            onClick={() => setPenColor(c)}
                            className={`w-6 h-6 rounded-full border-2 ${penColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 문제 목록 및 캔버스 렌더링 */}
                  <div className="space-y-8">
                    {solvedProblems.map((prob, idx) => (
                      <div key={prob.id} className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl relative break-inside-avoid">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-base text-white">
                            [{idx + 1}] {prob.title}
                          </span>
                          <span className="text-xs text-slate-400">({prob.type === 'multiple' ? '객관식' : '주관식'})</span>
                        </div>

                        {prob.contentImage ? (
                          <img src={prob.contentImage} alt="문제지문" className="max-h-60 rounded mb-4" />
                        ) : (
                          <p className="text-sm text-slate-200 whitespace-pre-wrap mb-4">{prob.content}</p>
                        )}

                        {prob.type === 'multiple' && prob.options && (
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs mb-6">
                            {prob.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => setStudentAnswers({ ...studentAnswers, [prob.id]: String(i + 1) })}
                                className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                                  studentAnswers[prob.id] === String(i + 1)
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                {numIcons[i]} {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {prob.type === 'subjective' && (
                          <div className="mb-6">
                            <label className="block text-xs font-bold text-amber-400 mb-1">주관식 정답 입력:</label>
                            <input
                              type="text"
                              placeholder="정답 입력"
                              value={studentAnswers[prob.id] || ''}
                              onChange={(e) => setStudentAnswers({ ...studentAnswers, [prob.id]: e.target.value })}
                              className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                            />
                          </div>
                        )}

                        {/* 필기용 캔버스 */}
                        <div className="relative border border-slate-800 rounded-xl bg-slate-950/40 overflow-hidden print:hidden">
                          <canvas
                            ref={el => canvasRefs.current[prob.id] = el}
                            width={800}
                            height={300}
                            onMouseDown={(e) => handleCanvasStart(prob.id, e)}
                            onMouseMove={(e) => handleCanvasMove(prob.id, e)}
                            onMouseUp={() => handleCanvasEnd(prob.id)}
                            onTouchStart={(e) => handleCanvasStart(prob.id, e)}
                            onTouchMove={(e) => handleCanvasMove(prob.id, e)}
                            onTouchEnd={() => handleCanvasEnd(prob.id)}
                            className="w-full h-48 cursor-crosshair touch-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* 교사 상세보기 모달 */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-3xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                {viewingSubmission.studentName} 학생 제출 상세 결과 ({viewingSubmission.record.score}점)
              </h3>
              <button onClick={() => setViewingSubmission(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
              {viewingSubmission.problems.map((p, idx) => {
                const ans = viewingSubmission.record.answers[p.id] || '미제출';
                const isCorrect = ans.trim().toLowerCase() === (p.answer || '').trim().toLowerCase();

                return (
                  <div key={p.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>[{idx + 1}] {p.title}</span>
                      <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                        {isCorrect ? '정답' : '오답'}
                      </span>
                    </div>
                    <p className="text-slate-300">{p.content}</p>
                    <div className="pt-2 flex gap-4 text-slate-400 border-t border-slate-800/60">
                      <span>학생 답: <strong className="text-white">{ans}</strong></span>
                      <span>실제 정답: <strong className="text-emerald-400">{p.answer}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}