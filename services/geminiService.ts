import { GoogleGenAI, Type } from "@google/genai";
import { AppConfig, StrategicPlan } from "../types";

export async function generateStrategicPlan(config: AppConfig): Promise<StrategicPlan> {
  // Always initialize GoogleGenAI inside the function to ensure the most up-to-date API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `你是一名资深的CTO顾问。请根据以下研发团队配置和业务背景，生成一份完整的AI原生转型战略计划。
  
  团队配置：
  - 总人数：基于配置计算
  - 结构：Leader ${config.team.leader}人, DFX架构师 ${config.team.dfx}人
  - 理化生线：架构师 ${config.team.pcbDevs.arch}人, 后端 ${config.team.pcbDevs.backend}人, 终端 ${config.team.pcbDevs.terminal}人
  - AI自习室线：架构师 ${config.team.studyDevs.arch}人, 后端 ${config.team.studyDevs.backend}人, 终端 ${config.team.studyDevs.terminal}人
  - 共享资源：前端 ${config.team.sharedFrontend}人, 固件OS ${config.team.firmwareOs}人, 核心后端 ${config.team.coreBackend}人
  - 测试团队：${config.team.test}人（重点：请明确测试团队如何利用 AI 实现质量工程转型，如自动化阅卷准确率校验、大规模终端巡检脚本生成、AI 驱动的回归测试）。
  
  业务规模：
  - 理化生：${config.pcb.schools}所学校, ${config.pcb.labs}个实验室, ${config.pcb.units}台终端。状态：${config.pcb.status}。
  - AI自习室：${config.study.schools}所学校, ${config.study.units}台终端。状态：${config.study.status}。
  
  核心约束与痛点：${config.constraints}
  
  战略生成要求：
  1. 必须包含测试团队在各阶段的具体行动，如何与 DFX 架构师配合。
  2. 针对前端单点瓶颈，如何通过 AI 测试工具降低前端回归压力。
  3. 针对 1.44w 终端，测试团队如何构建 AI 自动化监控阈值。
  
  请输出 JSON 格式，包含路线图(roadmap)、产品优化建议(products)和一段深度的CTO诊断建议(advice)。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  status: { type: Type.STRING, description: "MUST be PLANNED, IN_PROGRESS, or COMPLETED" }
                },
                required: ["id", "title", "duration", "goal", "actions", "status"]
              }
            },
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  currentTech: { type: Type.STRING },
                  aiNativeTarget: { type: Type.STRING },
                  keyMoves: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["productName", "currentTech", "aiNativeTarget", "keyMoves"]
              }
            },
            advice: { type: Type.STRING }
          },
          required: ["roadmap", "products", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as StrategicPlan;
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}