
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTransformationAdvice(context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `你是一名资深的CTO顾问和AI架构师。针对以下公司的具体人力构成和业务背景，请提供一份深度的、具有实操性的AI原生转型建议。特别关注：
1. 共享前端人力如何通过AI提效？
2. 固件OS如何与上层AI Agent协同？
3. 20人研发团队如何快速建立AI原生文化？

背景：\n\n${context}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 } // 增加思考深度，处理人力分配难题
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "暂时无法获取AI深度建议，请检查网络或API配置。";
  }
}
