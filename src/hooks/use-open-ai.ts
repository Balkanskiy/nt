import OpenAI from "openai";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey:
    "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",
});

export const useOpenAi = () => {
  const getVision = async (base64_image: string, prompt: string) => {
    if (base64_image) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `${prompt}` },
              {
                type: "image_url",
                image_url: {
                  url: "https://www.trustedtarot.com/images/cards/S3.png",
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: "https://www.trustedtarot.com/images/cards/C4.png",
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: `${base64_image}`,
                },
              },
            ],
          },
        ],
      });

      return response.choices[0]?.message?.content;
    }

    return "No image provided";
  };

  return [getVision];
};
