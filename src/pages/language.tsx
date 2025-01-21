import { Select, SelectItem } from "@nextui-org/select";
import {
  Card,
  CardFooter,
  Image,
  Button,
  CircularProgress,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { useEffect, useState } from "react";

import bgVideo from "../assets/bg-videos.mp4";
import { getRandomCard } from "../pages/index";
import { useOpenAi } from "../hooks/use-open-ai";

import { title } from "@/components/primitives";
import { useStore } from "@/store/store.tsx";
import { TarotIcon as IconSvg } from "@/assets/tarot-icon";

export enum Languages {
  English = "en",
  Russian = "ru",
  German = "de",
}
export const languages = [
  { key: Languages.English, label: "English" },
  { key: Languages.Russian, label: "Russian" },
  { key: Languages.German, label: "German" },
];

export default function LanguagePage() {
  const {
    selectedLanguage,
    setSelectedLanguage,
    step,
    setStep,
    prompt,
    setPrompt,
  }: any = useStore();

  const [cardSrc, setCardSrc] = useState(
    `https://www.trustedtarot.com/images/cards/${getRandomCard()}.png`,
  );
  const [base64String, setBase64String] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<any>("");

  const [getVision] = useOpenAi();

  useEffect(() => {
    setCardSrc(
      base64String ||
        `https://www.trustedtarot.com/images/cards/${getRandomCard()}.png`,
    );
  }, [step]);

  useEffect(() => {
    if (selectedLanguage === Languages.Russian) {
      setPrompt("растолкуй эти карты таро");
    } else {
      setPrompt("Interpret these tarot cards");
    }
  }, [selectedLanguage]);

  const endContent = (
    <Button color="secondary" size="sm" onPress={setStep}>
      Ask
    </Button>
  );

  const selectLanguage = (e: any) => {
    setSelectedLanguage(e.target.value);
    setStep();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;

        setBase64String(result);
        setCardSrc(result);
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }

    setStep();
  };

  const getAnswer = async () => {
    if (base64String) {
      setIsLoading(true);
      const vision = await getVision(base64String, prompt);

      setTimeout(() => {
        setAnswer(vision);
        setIsLoading(false);
        setStep();
      }, 3000);
    }
  };

  return (
    <div className={"language-page dark"}>
      {isLoading ? (
        <div className={"relative"}>
          <CircularProgress
            classNames={{
              svg: "w-[400px] h-[400px] drop-shadow-md",
              indicator: "stroke-white",
              track: "stroke-white/10",
              value: "text-white",
            }}
            strokeWidth={2}
          />
          <div
            className={
              "absolute top-0 left-0 flex align-middle justify-center w-[100%] h-[100%]"
            }
          >
            <IconSvg fill={"white"} width={150} />
          </div>
        </div>
      ) : (
        <>
          <h4
            className={`flex justify-center flex-col items-center mb-5 text-white ${title({ size: "lg" })}`}
          >
            <IconSvg fill={"white"} width={100} />
            Neural Tarot
          </h4>
          {step !== 4 && (
            <>
              <Card
                isBlurred
                isFooterBlurred
                className="h-[520px] w-[300px] col-span-6 sm:col-span-5"
                shadow={"lg"}
              >
                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                  src={cardSrc}
                />
                <CardFooter className="absolute gap-4 bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                  {step <= 0 && (
                    <Select
                      className="max-w-xs"
                      placeholder="Select Prediction Language"
                      selectedKeys={[selectedLanguage]}
                      onChange={selectLanguage}
                    >
                      {languages.map((language) => (
                        <SelectItem key={language.key}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  {step === 1 && (
                    <Textarea
                      className="max-w-xs"
                      endContent={endContent}
                      placeholder="Ask anything"
                      value={prompt}
                      onValueChange={setPrompt}
                    />
                  )}
                  {step === 2 && (
                    <>
                      <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="fileInput">
                        <Button color="secondary">Download Card</Button>
                      </label>
                      <span className={"text-black"}>or </span>
                      <Button
                        color="secondary"
                        onPress={() => console.log("choose")}
                      >
                        Pick Random
                      </Button>
                    </>
                  )}
                  {step === 3 && (
                    <div className="flex w-full justify-center">
                      <Button color="danger" onPress={getAnswer}>
                        Get Prediction
                      </Button>
                    </div>
                  )}
                  {step === 4 && !!answer && <>{answer}</>}
                </CardFooter>
              </Card>
            </>
          )}
          {step === 4 && (
            <Card className={"max-w-[70vw]"}>
              <CardHeader className={"flex justify-center"}>
                <Image isBlurred height={300} shadow="lg" src={cardSrc} />
              </CardHeader>
              <CardBody>
                <p dangerouslySetInnerHTML={{ __html: answer }} />
              </CardBody>
            </Card>
          )}
        </>
      )}
      <video autoPlay loop muted className="video-background">
        <source src={bgVideo} type="video/mp4" />
      </video>
    </div>
  );
}
