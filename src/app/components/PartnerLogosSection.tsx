import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { Logo, Logos3 } from "./ui/logos3";

import choreographers from "../../assets/90199beb5a874cc4fa092a81d81d32b6075a164d.png";
import mafal from "../../assets/bd74627b310de222d4c9dd78f511e837cc276f00.png";
import jerusalem from "../../assets/623f68a5851b1bb80dc2fea7371524231acd3062.png";
import danceLibrary from "../../assets/473fdb91f99c12360650b37404dd18d498ee9d0b.png";
import cultureSports from "../../assets/4675ffc0c75efe2ccec5fff8629c20aac74e5340.png";
import musicAcademy from "../../assets/2ed1fb418b05cdef3af5a22bed5117c42038abca.png";

const partnerLogos: Logo[] = [
  {
    id: "partner-choreographers",
    description: "Choreographers",
    image: choreographers,
    className: "h-[50px] w-auto sm:h-[58px]",
  },
  {
    id: "partner-mifal-hapayis",
    description: "Mifal Hapayis",
    image: mafal,
    className: "h-[56px] w-auto sm:h-[64px]",
  },
  {
    id: "partner-jerusalem",
    description: "Jerusalem Municipality",
    image: jerusalem,
    className: "h-[60px] w-auto sm:h-[68px]",
  },
  {
    id: "partner-dance-library",
    description: "Dance Library",
    image: danceLibrary,
    className: "h-[56px] w-auto sm:h-[64px]",
  },
  {
    id: "partner-culture-sports",
    description: "Ministry of Culture and Sport",
    image: cultureSports,
    className: "h-[60px] w-auto sm:h-[68px]",
  },
  {
    id: "partner-music-academy",
    description: "Jerusalem Academy of Music and Dance",
    image: musicAcademy,
    className: "h-[60px] w-auto sm:h-[68px]",
  },
];

type PartnerLogosSectionProps = React.ComponentProps<"div">;

export function PartnerLogosSection({
  className,
  ...props
}: PartnerLogosSectionProps) {
  const { isRTL } = useLanguage();
  const title = isRTL
    ? "\u05EA\u05DE\u05D9\u05DB\u05D4 \u05D5\u05D1\u05E9\u05D9\u05EA\u05D5\u05E3"
    : "Support and Collaboration";

  return (
    <div {...props} className={cn("mx-auto w-full max-w-6xl", className)}>
      <Logos3 heading={title} logos={partnerLogos} />
    </div>
  );
}
