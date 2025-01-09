import { Select, SelectItem } from "@nextui-org/select";
import { Card, CardFooter, Image } from "@nextui-org/react";

import bgVideo from "../assets/bg-videos.mp4";
import { getRandomCard } from "../pages/index";

import { title } from "@/components/primitives";
import { useStore } from "@/store/store.tsx";

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
  // const [selectedLanguage, setSelectedLanguage] = useState(Languages.English);
  const selectedLanguage = useStore((state: any) => state.selectedLanguage);
  const setSelectedLanguage = useStore(
    (state: any) => state.setSelectedLanguage,
  );

  const selectLanguage = (e: any) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className={"language-page dark"}>
      <h4 className={title({ color: "yellow", size: "lg" })}>Neural Tarot</h4>
      <Card
        isFooterBlurred
        className="h-[520px] w-[300px] col-span-6 sm:col-span-5"
      >
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src={`https://www.trustedtarot.com/images/cards/${getRandomCard()}.png`}
        />
        <CardFooter className="absolute gap-4 bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <Select
            className="max-w-xs "
            label="Language"
            placeholder="Select Language"
            selectedKeys={[selectedLanguage]}
            onChange={selectLanguage}
          >
            {languages.map((language) => (
              <SelectItem key={language.key}>{language.label}</SelectItem>
            ))}
          </Select>
        </CardFooter>
      </Card>
      <video autoPlay loop muted className="video-background">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
