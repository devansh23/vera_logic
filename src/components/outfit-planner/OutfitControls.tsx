import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shuffle, 
  Save, 
  Calendar as CalendarIcon, 
  Trash2 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define these types locally since they can't be imported from @/pages/OutfitPlanner
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface OutfitItem {
  id: string;
  items: ClothingItem[];
  name: string;
  date?: Date;
}

interface Outfit {
  id: string;
  name: string;
  items: {
    id: string;
    left: number;
    top: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface OutfitControlsProps {
  outfits: Outfit[];
  onSchedule: (outfitId: string, date: Date, title: string) => void;
}

export const OutfitControls = ({ outfits, onSchedule }: OutfitControlsProps) => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [scheduleTitle, setScheduleTitle] = useState('');

  const handleSchedule = () => {
    if (selectedOutfit && scheduleTitle.trim()) {
      onSchedule(selectedOutfit.id, scheduleDate, scheduleTitle);
      setShowScheduleDialog(false);
      setScheduleTitle('');
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Saved Outfits</h2>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="space-y-2">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="font-medium">{outfit.name}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedOutfit(outfit);
                    setShowScheduleDialog(true);
                  }}
                >
                  Schedule
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-2 gap-4">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="border rounded-lg p-4 hover:border-purple-500 cursor-pointer"
                onClick={() => {
                  setSelectedOutfit(outfit);
                  setShowScheduleDialog(true);
                }}
              >
                <h3 className="font-medium mb-2">{outfit.name}</h3>
                <p className="text-sm text-gray-500">
                  {outfit.items.length} items
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent aria-describedby="schedule-outfit-description">
          <DialogHeader>
            <DialogTitle>Schedule Outfit</DialogTitle>
            <DialogDescription id="schedule-outfit-description">
              Choose a date and title to add this outfit to your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                placeholder="Enter a title for this schedule"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date
              </label>
              <Input
                type="date"
                value={scheduleDate.toISOString().split('T')[0]}
                onChange={(e) => setScheduleDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSchedule} disabled={!scheduleTitle.trim()}>
              Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OutfitControls;
