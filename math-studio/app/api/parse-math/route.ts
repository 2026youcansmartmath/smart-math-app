import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const { problemBase64, answerBase64, mimeType } = await req.json();

    if (!problemBase64 || !answerBase64) {
      return NextResponse.json({ error: '문제 및 답지 이미지가 필요합니다.' }, { status: 400 });
    }

    const cleanProblemBase64 = problemBase64.replace(/^data:image\/\w+;base64,/, '');
    const cleanAnswerBase64 = answerBase64.replace(/^data:image\/\w+;base64,/, '');

    // 현재 구글 AI Studio 표준 추천 모델
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `첫 번째 이미지는 수학 문제 영역, 두 번째 이미지는 답지 영역입니다. 
    문항 번호를 파싱하고 1번 문제-1번 답지 형식으로 매칭하여 JSON 형식으로 반환해 주세요.
    반드시 JSON 형태로만 응답하세요:
    {
      "problems": [
        {
          "title": "문제 번호",
          "content": "문제 지문",
          "difficulty": "난이도",
          "options": ["①...", "②..."],
          "answer": "정답",
          "explanation": "해설"
        }
      ]
    }`;

    const response = await model.generateContent([
      prompt,
      { inlineData: { data: cleanProblemBase64, mimeType: mimeType || 'image/png' } },
      { inlineData: { data: cleanAnswerBase64, mimeType: mimeType || 'image/png' } },
    ]);

    const resultText = response.response.text();
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { problems: [] };

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || '인식 실패' }, { status: 500 });
  }
}