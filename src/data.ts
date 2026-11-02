export type ResultId =
  | "steady"
  | "spark"
  | "observer"
  | "advisor"
  | "adventurer"
  | "empath"
  | "peacemaker"
  | "surprise";

export type Answer = {
  label: string;
  text: string;
  primary: ResultId;
  secondary: ResultId;
};

export type Question = {
  prompt: string;
  answers: [Answer, Answer, Answer, Answer];
};

export type ResultProfile = {
  id: ResultId;
  name: string;
  intro: string;
  traits: [string, string, string];
  strength: string;
  reminder: string;
};

const answer = (
  label: string,
  text: string,
  primary: ResultId,
  secondary: ResultId,
): Answer => ({ label, text, primary, secondary });

export const questions: Question[] = [
  {
    prompt: "친구들과 모였을 때 나는?",
    answers: [
      answer("A", "먼저 말을 걸고 분위기를 연다.", "spark", "adventurer"),
      answer("B", "친구들의 이야기를 듣고 반응한다.", "empath", "peacemaker"),
      answer("C", "친한 친구와 깊은 대화를 나눈다.", "observer", "empath"),
      answer("D", "즉흥적으로 새로운 일을 제안한다.", "adventurer", "spark"),
    ],
  },
  {
    prompt: "친구가 고민을 털어놓으면?",
    answers: [
      answer("A", "먼저 공감해 준다.", "empath", "steady"),
      answer("B", "현실적인 해결 방법을 함께 찾는다.", "advisor", "steady"),
      answer("C", "충분히 이야기할 수 있도록 들어준다.", "steady", "observer"),
      answer("D", "기분 전환할 활동을 제안한다.", "spark", "adventurer"),
    ],
  },
  {
    prompt: "친구들과 약속을 잡을 때 나는?",
    answers: [
      answer("A", "먼저 날짜와 장소를 정한다.", "steady", "advisor"),
      answer("B", "모두의 의견을 확인한다.", "peacemaker", "empath"),
      answer("C", "친한 친구가 정하는 계획을 선호한다.", "observer", "steady"),
      answer("D", "즉흥적으로 새로운 장소에 가고 싶다.", "adventurer", "spark"),
    ],
  },
  {
    prompt: "친구와 의견이 충돌하면?",
    answers: [
      answer("A", "솔직하게 내 생각을 설명한다.", "advisor", "steady"),
      answer("B", "서로의 입장을 차분하게 확인한다.", "peacemaker", "observer"),
      answer("C", "감정이 가라앉을 때까지 시간을 갖는다.", "observer", "peacemaker"),
      answer("D", "대화로 분위기를 풀어본다.", "surprise", "spark"),
    ],
  },
  {
    prompt: "친구가 평소와 다르게 조용하다면?",
    answers: [
      answer("A", "먼저 다가가 괜찮은지 묻는다.", "empath", "advisor"),
      answer("B", "부담스럽지 않게 옆에 있어 준다.", "steady", "empath"),
      answer("C", "혼자만의 시간이 필요한지 살펴본다.", "observer", "peacemaker"),
      answer("D", "기분이 나아질 만한 활동을 제안한다.", "adventurer", "spark"),
    ],
  },
  {
    prompt: "친구들이 나를 자주 찾는 이유는?",
    answers: [
      answer("A", "함께 있으면 에너지가 생겨서.", "spark", "adventurer"),
      answer("B", "고민을 편하게 이야기할 수 있어서.", "empath", "observer"),
      answer("C", "믿고 맡길 수 있어서.", "steady", "advisor"),
      answer("D", "새로운 경험을 함께할 수 있어서.", "adventurer", "spark"),
    ],
  },
  {
    prompt: "친구와 하루를 보낸다면?",
    answers: [
      answer("A", "여러 명이 함께하는 신나는 활동.", "spark", "adventurer"),
      answer("B", "한두 명과 편안하게 이야기하기.", "empath", "steady"),
      answer("C", "조용한 장소에서 깊은 대화하기.", "observer", "advisor"),
      answer("D", "계획 없이 새로운 곳을 찾아다니기.", "adventurer", "surprise"),
    ],
  },
  {
    prompt: "친구에게 서운한 일이 생기면?",
    answers: [
      answer("A", "솔직하게 내 마음을 전달한다.", "advisor", "empath"),
      answer("B", "상대의 상황을 먼저 이해하려 한다.", "peacemaker", "empath"),
      answer("C", "생각을 정리한 뒤 차분히 이야기한다.", "observer", "advisor"),
      answer("D", "함께 시간을 보내며 자연스럽게 풀어본다.", "spark", "peacemaker"),
    ],
  },
  {
    prompt: "새로운 친구를 만나면?",
    answers: [
      answer("A", "먼저 인사하고 대화를 시작한다.", "spark", "advisor"),
      answer("B", "상대가 편안해질 때까지 기다린다.", "empath", "observer"),
      answer("C", "공통 관심사를 찾으며 천천히 친해진다.", "observer", "steady"),
      answer("D", "재미있는 주제로 말을 건다.", "adventurer", "spark"),
    ],
  },
  {
    prompt: "내가 생각하는 좋은 친구는?",
    answers: [
      answer("A", "언제든 솔직하게 이야기할 수 있는 친구.", "advisor", "observer"),
      answer("B", "힘든 순간에도 곁에 있어 주는 친구.", "steady", "empath"),
      answer("C", "서로의 차이를 존중해 주는 친구.", "peacemaker", "observer"),
      answer("D", "함께 새로운 추억을 만들어 주는 친구.", "adventurer", "spark"),
    ],
  },
];

export const resultProfiles: ResultProfile[] = [
  {
    id: "steady",
    name: "든든한 버팀목",
    intro: "네가 곁에 있다는 사실만으로 친구들은 한결 안심해요.",
    traits: ["약속을 소중히 지켜요", "필요한 순간 곁을 지켜요", "믿음이 쌓이는 관계를 만들어요"],
    strength: "기복이 있는 날에도 변함없이 곁을 지켜 주는 안정감이 가장 큰 선물이에요.",
    reminder: "늘 든든한 사람도 기대고 도움받을 수 있어요. 네 마음도 친구에게 들려주세요.",
  },
  {
    id: "spark",
    name: "분위기 메이커",
    intro: "네가 함께하면 평범한 만남도 유쾌한 기억으로 바뀌어요.",
    traits: ["먼저 말을 걸어요", "주변에 활기를 더해요", "함께 웃을 순간을 잘 만들어요"],
    strength: "어색한 분위기를 자연스럽게 풀고 친구들이 서로 가까워지도록 도와줘요.",
    reminder: "모두를 즐겁게 할 필요는 없어요. 조용히 쉬고 싶은 네 모습도 괜찮아요.",
  },
  {
    id: "observer",
    name: "조용한 관찰자",
    intro: "말보다 마음을 먼저 읽는 섬세함이 너의 매력이에요.",
    traits: ["작은 변화를 잘 알아차려요", "깊고 진솔한 대화를 좋아해요", "상대의 속도를 존중해요"],
    strength: "친구가 말하지 못한 마음까지 세심하게 살피고 편안한 공간을 만들어 줘요.",
    reminder: "마음을 알아주길 기다리기보다 네 생각을 먼저 말해도 괜찮아요.",
  },
  {
    id: "advisor",
    name: "솔직한 조언자",
    intro: "진심을 담은 한마디로 친구가 다시 앞으로 나아가게 해요.",
    traits: ["생각을 분명하게 전해요", "문제의 핵심을 잘 찾아요", "친구의 가능성을 믿어요"],
    strength: "필요한 순간 현실적인 관점과 용기를 건네 친구의 선택을 도와줘요.",
    reminder: "답을 주기 전에 어떤 도움이 필요한지 물어보면 공감이 더 잘 전해져요.",
  },
  {
    id: "adventurer",
    name: "자유로운 모험가",
    intro: "새로운 경험을 향해 함께 떠날 친구를 설레게 만들어요.",
    traits: ["호기심이 많아요", "즉흥적인 즐거움을 좋아해요", "친구에게 새로운 시야를 열어줘요"],
    strength: "익숙한 일상 밖으로 친구를 이끌어 특별한 추억을 함께 만들어요.",
    reminder: "모든 친구가 같은 속도로 움직이지는 않아요. 가끔은 천천히 가도 충분해요.",
  },
  {
    id: "empath",
    name: "따뜻한 공감러",
    intro: "네 곁에서는 어떤 마음도 조금 더 편하게 꺼낼 수 있어요.",
    traits: ["감정을 다정하게 받아들여요", "따뜻한 반응을 건네요", "친구의 기쁨과 걱정을 함께 나눠요"],
    strength: "판단보다 공감을 먼저 건네 친구가 자기 모습 그대로 있을 수 있게 해줘요.",
    reminder: "친구의 감정을 모두 책임질 필요는 없어요. 너의 에너지도 잘 돌봐주세요.",
  },
  {
    id: "peacemaker",
    name: "평화로운 중재자",
    intro: "서로 다른 마음 사이에서 대화가 이어지도록 다리를 놓아요.",
    traits: ["여러 입장을 고르게 살펴요", "차분한 대화를 이끌어요", "서로의 차이를 존중해요"],
    strength: "갈등 속에서도 공통점을 찾아 관계가 다시 연결될 수 있게 도와줘요.",
    reminder: "모두를 만족시키는 일이 네 몫은 아니에요. 네 입장도 소중하게 표현해요.",
  },
  {
    id: "surprise",
    name: "반전 매력 소유자",
    intro: "차분함과 엉뚱함을 오가며 친구들에게 신선한 즐거움을 줘요.",
    traits: ["상황에 따라 다채로운 면을 보여요", "독특한 시각을 가지고 있어요", "가까워질수록 매력이 깊어져요"],
    strength: "예상 밖의 따뜻함과 재치로 관계에 특별한 색을 더해요.",
    reminder: "한 가지 모습으로만 보이려 하지 않아도 돼요. 다채로운 너를 편하게 보여주세요.",
  },
];

export const getResultProfile = (id: ResultId): ResultProfile =>
  resultProfiles.find((profile) => profile.id === id) ?? resultProfiles[0];
