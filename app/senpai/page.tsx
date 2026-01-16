"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeLoaderIcon, AnimeUploadIcon, AnimeCloseIcon } from "@/components/ui/AnimeIcons";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCurrentUser } from "@/components/UserProvider";
import { cn } from "@/lib/utils";

import { MorphingText } from "@/components/ui/morphing-text";

export default function SenpaiDashboard() {
  const { user } = useCurrentUser();

  const generateUploadUrl = useMutation(api.daily_drops.generateUploadUrl);
  const createDrop = useMutation(api.daily_drops.create);
  const isDropped = useQuery(api.daily_drops.getDailyDrop);

  const updateDrop = useMutation(api.daily_drops.update);
  const futureDrops = useQuery(api.daily_drops.getUpcomingDrops);

  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [images, setImages] = useState<(File | null)[]>([
    null, null, null, null, null,
  ]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null, null, null, null, null,
  ]);

  const [editingDropId, setEditingDropId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (
    user?.email != process.env.NEXT_PUBLIC_SENPAI_EMAIL ||
    user?.username != process.env.NEXT_PUBLIC_SENAPI_USERNAME
  ) {
    notFound();
  }

  const handleEditSelect = (drop: NonNullable<typeof futureDrops>[number]) => {
    setTitle(drop.title);
    setScheduledDate(drop.date);
    setEditingDropId(drop._id);

    const newPreviews = [null, null, null, null, null] as (string | null)[];
    drop.images.forEach((img, idx) => {
      if (idx < 5) newPreviews[idx] = img.url;
    });
    setPreviews(newPreviews);
    setImages([null, null, null, null, null]);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setTitle("");
    setEditingDropId(null);
    setPreviews([null, null, null, null, null]);
    setImages([null, null, null, null, null]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split("T")[0]);
  };

  const handleImageSelect = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const objectUrl = URL.createObjectURL(file);
      const newPreviews = [...previews];
      if (newPreviews[index] && newPreviews[index]!.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]!);
      }
      newPreviews[index] = objectUrl;
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...previews];
    if (newPreviews[index] && newPreviews[index]!.startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]!);
    }
    newPreviews[index] = null;
    setPreviews(newPreviews);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setTitleError(true);
      return;
    }

    const activeImages = images.filter((img): img is File => img !== null);
    const hasNewImages = activeImages.length > 0;

    if (editingDropId && !hasNewImages) {
      setIsUploading(true);
      try {
        await updateDrop({
          dropId: editingDropId as any,
          title,
          date: scheduledDate,
        });
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
        cancelEdit();
      } catch (error) {
        console.error(error);
        alert("Failed to update drop");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    setIsUploading(true);
    try {
      const storageIds = await Promise.all(
        activeImages.map(async (image) => {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
          const { storageId } = await result.json();
          return storageId;
        }),
      );

      if (editingDropId) {
        await updateDrop({
          dropId: editingDropId as any,
          title,
          date: scheduledDate,
          imageStorageIds: storageIds,
        });
      } else {
        await createDrop({
          title,
          imageStorageIds: storageIds,
          date: scheduledDate,
        });
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);

      cancelEdit(); // Resets form
    } catch (error) {
      console.error(error);
      alert("Failed to save drop");
    } finally {
      setIsUploading(false);
    }
  };

  if (isDropped === undefined) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <AnimeLoaderIcon className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // We only show the "Dropped" screen if there is an active drop AND we are not in edit mode
  // But actually Senpai might want to see the creation form even if a drop is active (to schedule next ones).
  // Let's modify the return logic to always show dashboard, maybe "Active Drop" info at top.

  const activeDropInfo = isDropped ? (
    <div className="flex flex-col items-center justify-center py-10 space-y-4 border-b border-white/10 mb-10">
      <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-pink-500">
        LIVE DROP ACTIVE
      </h2>
      <div className="flex gap-4">
        <div className="px-4 py-2 bg-secondary/10 rounded border border-white/5">
          <span className="text-muted-foreground uppercase text-xs font-bold mr-2">Title</span>
          <span className="font-bold text-primary">{isDropped.title}</span>
        </div>
        <Link href="/">
          <Button size="sm" variant="outline">View</Button>
        </Link>
      </div>
    </div>
  ) : null;

  const hasImages = images.filter((img) => img !== null).length > 0;
  const canSubmit = editingDropId ? true : hasImages;

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      {activeDropInfo}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {editingDropId ? "Edit Scheduled Drop" : "Create Daily Drop"}
        </h1>
        {editingDropId && (
          <Button variant="ghost" onClick={cancelEdit} className="text-muted-foreground hover:text-white">
            Cancel Edit
          </Button>
        )}
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Drop Title</label>
            <Input
              placeholder="e.g. Summer Beach Episode"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(false);
              }}
              className="text-lg"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduled Date</label>
            <div className="relative">
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="text-lg w-full [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <p className="text-xs text-muted-foreground">Defaults to tomorrow. Today: {new Date().toISOString().split("T")[0]}</p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((_, index) => (
            <Card
              key={index}
              className={cn(
                "relative aspect-auto border-dashed border-2 overflow-hidden flex flex-col group transition-colors",
                editingDropId && !images[index] && previews[index] ? "border-primary/50 bg-primary/5" : "hover:border-primary"
              )}
            >
              <CardContent className="p-0 h-full flex items-center justify-center bg-muted/20">
                {previews[index] ? (
                  <div className="relative w-full h-full min-h-50">
                    <Image
                      src={previews[index]!}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <AnimeCloseIcon className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center p-6 cursor-pointer w-full h-full min-h-50"
                    onClick={() => fileInputRefs.current[index]?.click()}
                  >
                    <AnimeUploadIcon className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground font-medium">
                      Select Image #{index + 1}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleImageSelect(index, e)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isUploading || isSuccess}
            className={cn(
              "w-full md:w-auto min-w-40",
              !canSubmit && !isSuccess && !isUploading &&
              "bg-destructive hover:bg-destructive/90",
              isSuccess && "bg-primary hover:bg-secondary text-secondary",
              titleError && "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
            )}
          >
            {isUploading ? (
              <>
                <AnimeLoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <MorphingText className="font-bold">
                {isSuccess
                  ? (editingDropId ? "Drop Updated!" : "Scheduled!")
                  : titleError
                    ? "PLEASE ENTER A TITLE"
                    : !canSubmit
                      ? "Add Images"
                      : (editingDropId ? "Update Drop" : "Schedule Drop")}
              </MorphingText>
            )}
          </Button>
        </div>
      </div>

      {/* Upcoming Drops Section */}
      <div className="mt-20 pt-10 border-t border-white/10">
        <h2 className="text-2xl font-black italic mb-6 text-muted-foreground">UPCOMING SCHEDULE</h2>

        {!futureDrops ? (
          <div className="flex justify-center py-8"><AnimeLoaderIcon className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : futureDrops.length === 0 ? (
          <p className="text-muted-foreground">No future drops scheduled.</p>
        ) : (
          <div className="space-y-4">
            {futureDrops.map(drop => (
              <div
                key={drop._id}
                onClick={() => handleEditSelect(drop)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl bg-secondary/5 border border-white/5 hover:bg-secondary/10 hover:border-primary/20 transition-all cursor-pointer",
                  editingDropId === drop._id && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-black/20 rounded-lg border border-white/5">
                    <span className="text-xs font-bold text-muted-foreground uppercase">{new Date(drop.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-primary">{new Date(drop.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{drop.title}</h3>
                    <p className="text-sm text-muted-foreground">{drop.images.length} Images</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
