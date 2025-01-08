import { useEffect, useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/progress";
import { Select, SelectItem } from "@nextui-org/select";
import OpenAI from "openai";
import { title } from "@/components/primitives";

enum Languages {
  English = "en",
  Russian = "ru",
  German = "de",
}
export const languages = [
  { key: Languages.English, label: "English" },
  { key: Languages.Russian, label: "Russian" },
  { key: Languages.German, label: "German" },
];

const getPrompt = (lang: Languages) => {
  switch (lang) {
    case Languages.Russian:
      return "растолкуй эти карты таро";
    case Languages.German:
      return "Interpretieren Sie diese Tarotkarten";
    default:
      return "Interpret these tarot cards";
  }
};

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey:
    "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",
});

const getVision = async (base64_image: string, prompt) => {
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

export default function IndexPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(Languages.English);
  const [prompt, setPrompt] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<any>("No answer yet");
  const [base64String, setBase64String] = useState<string | null>(null);

  const selectLanguage = (e: any) => {
    setSelectedLanguage(e.target.value);
  };

  const getAnswer = async () => {
    if (base64String) {
      setIsLoading(true);
      const vision = await getVision(base64String, prompt);

      setAnswer(vision);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPrompt(getPrompt(selectedLanguage));
  }, [selectedLanguage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        setBase64String(result);
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  };

  return (
    <div>
      {isLoading && <CircularProgress />}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({ color: "cyan" })}>Neural&nbsp;</span>
          <span className={title({ color: "violet" })}>T&nbsp;</span>
        </div>

        <Select
          className="max-w-xs"
          label="Language"
          placeholder="Select Language"
          selectedKeys={[selectedLanguage]}
          onChange={selectLanguage}
        >
          {languages.map((language) => (
            <SelectItem key={language.key}>{language.label}</SelectItem>
          ))}
        </Select>

        <div className="mt-8">
          <Textarea
            className="max-w-xs"
            label="Prompt"
            placeholder="Type something"
            value={prompt}
            onValueChange={setPrompt}
          />
          <Input type={"file"} onChange={handleFileChange} />
          <p className="text-default-500 text-small">Input value: {prompt}</p>
          <Button color="primary" isDisabled={base64String === null || prompt === null} onPress={getAnswer}>
            get vision
          </Button>
          <Card>
            <CardBody>
              <p>{answer}</p>
            </CardBody>
          </Card>
          <img alt="" src={base64String || ""} />
          {base64String && (
            <div>
              <p>Base64 String:</p>
              <textarea readOnly cols={50} rows={10} value={base64String} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
