import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { title } from "@/components/primitives";
import {Card, CardBody} from "@nextui-org/react";
import {CircularProgress} from "@nextui-org/progress";

import OpenAI from "openai";
import { useEffect } from "react";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey:
    "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",
});

const getVision = async (base64_image: string) => {
  if (base64_image) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "растолкуй эти карты таро" },
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
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<any>("No answer yet");
  const [base64String, setBase64String] = useState<string | null>(null);

  useEffect(() => {
    // completion.then((result) => console.log(result.choices[0].message));
  }, []);

  const getAnswer = async () => {
    if (base64String) {
      setIsLoading(true);
      const vision = await getVision(base64String);

      setAnswer(vision);
      setIsLoading(false);
    }
  };

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
          <span className={title()}>Neural&nbsp;</span>
          <span className={title({ color: "violet" })}>T&nbsp;</span>
        </div>

        <div className="mt-8">
          <Input
            placeholder="Type something"
            value={value}
            onValueChange={setValue}
          />
          <Input type={"file"} onChange={handleFileChange} />
          <p className="text-default-500 text-small">Input value: {value}</p>
          <Button color="primary" onPress={getAnswer}>
            get vision
          </Button>
          <Card>
            <CardBody>
              <p>{answer}</p>
            </CardBody>
          </Card>
          <img src={base64String || ""} alt="" />
          {base64String && (
            <div>
              <p>Base64 String:</p>
              <textarea value={base64String} readOnly rows={10} cols={50} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
