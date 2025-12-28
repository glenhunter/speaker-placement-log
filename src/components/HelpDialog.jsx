import { useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-white hover:text-sky_blue_light-700 transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="w-6 h-6" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#e5e7eb" }}
        aria-describedby="help-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">What is this?</DialogTitle>
        </DialogHeader>
        <div id="help-description" className="space-y-6">
          <p className="leading-7">
            Welcome. This started as an experiment working with Claude Code to
            build a simple React app and kinda ballooned from there.
          </p>

          <p className="leading-7 font-semibold">
            TL/DR Create a baseline first, then tweak. Record your tweaks and
            star the best one. If you want your values to persist create a user.
          </p>

          <p className="leading-7">
            Start by creating a baseline. This is the default position for your
            speakers that you will be measuring from. On the Create Baseline
            page there are several standard placement methods to choose from and
            you can see the differing measurements in each tab. Note that you
            can only have one active baseline at a time.
          </p>

          <p className="leading-7">
            These layout methods are all fine and well but unless you're one of
            the fortunate few who have a dedicated listening room it's likely
            that you'll have to adjust the positioning to account for furniture,
            room acoustics, spousal approval, and personal sonic preferences.
          </p>

          <p className="leading-7">
            That's where the subjective adjustments come into play. Once you
            have your speakers in the baseline position give a listen to a song
            or two to create a mental baseline of the sound. A couple of notes
            here: first it's hard to remember subjective impressions of a full
            song for long so listening sessions should be continuous, second
            even a tiny change in volume can result in a different perception of
            the sound, so keep your hands off the volume control. Sometimes I
            just listen to specific parts of a song because (I feel) like it's
            easier to hold that in my memory than a whole song. This also can
            allow you to focus on certain elements of the sonic presentation. To
            that end many pages about speaker placement reccomend starting with
            a song with a strong continuous bass line and strong centered vocals
            because it is thought that if you can get the bass right the rest
            will fall into place.
          </p>

          <p className="leading-7">
            So once you have a good sense of the sound of default position you
            can start tweaking the speaker position - hopefully your speakers
            aren't too heavy. I strongly suggest that you only change one value
            at a time, i.e. move the speakers forwards/backwards or left/right
            but not both. You can either enter the difference from baseline in
            the front/side/listening position fields or use the full (new)
            measurement from the walls.
          </p>

          <p className="leading-7">
            Use the subjective measurement buttons to record your impressions of
            the sound. The buttons move in increments of "+/- 1" and the values
            are totaled for a completely meaningless subjective score. In theory
            a positive total means that the new position is "better" than the
            baseline and a negative total is "worse". Wouldn't it be nice if it
            were that easy? But we know that moving the speaker might make the
            bass better but the vocals worse, etc etc. So the numbers are there
            to help, but this is a subjective measurement tool so you're best
            off trusting your ears.
          </p>

          <p className="leading-7">
            When you submit the changes they'll appear in the sidebar and when
            you find a position you like you can "Star" it and it will appear at
            the top of the list. You can star as many as you like. Tip: just for
            fun try all the different positioning methods and star the best
            variation of each. Now you can compare them all and see which you
            like best.
          </p>

          <p className="leading-7">
            What about DSP you ask? I've heard great things about DSP and I'm
            looking forward to trying it out when I can afford to buy a MiniDSP
            unit. For now I'm moving my speakers around and having fun listening
            to my music. I hope if you use this tool you find it helpful.
          </p>

          <p className="leading-7">
            Why login? If you want to save your data so that it's available
            later you have to create a user. If you don't, that's ok, everything
            will work but when you close the browser tab your data will be gone
            forever.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
