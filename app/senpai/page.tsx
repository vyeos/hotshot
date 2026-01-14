"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import Image from "next/image";
import { useCurrentUser } from "@/components/UserProvider";

export default function SenpaiDashboard() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const generateUploadUrl = useMutation(api.daily_drops.generateUploadUrl);
  const createDrop = useMutation(api.daily_drops.create);

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (
    user?.email != process.env.NEXT_PUBLIC_SENPAI_EMAIL ||
    user?.username != process.env.NEXT_PUBLIC_SENAPI_USERNAME
  ) {
    notFound();
  }

  const handleImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const objectUrl = URL.createObjectURL(file);
      const newPreviews = [...previews];
      if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!); 
      newPreviews[index] = objectUrl;
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...previews];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
    newPreviews[index] = null;
    setPreviews(newPreviews);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title) return alert("Please enter a title");

    const activeImages = images.filter((img): img is File => img !== null);
    if (activeImages.length === 0) return alert("Please upload at least 1 image");

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
        })
      );

      await createDrop({
        title,
        imageStorageIds: storageIds,
      });

      alert("Daily Drop Created Successfully!");
      setTitle("");
      setImages([null, null, null, null, null]);
      setPreviews([null, null, null, null, null]);
    } catch (error) {
      console.error(error);
      alert("Failed to create drop");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Create Daily Drop</h1>

      <div className="space-y-8">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Drop Title</label>
          <Input
            placeholder="e.g. Summer Beach Episode"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((_, index) => (
            <Card key={index} className="relative aspect-auto border-dashed border-2 overflow-hidden flex flex-col group hover:border-primary transition-colors">
              <CardContent className="p-0 h-full flex items-center justify-center bg-muted/20">
                {previews[index] ? (
                  <div className="relative w-full h-full min-h-[200px]">
                    <Image
                      src={previews[index]!}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center p-6 cursor-pointer w-full h-full min-h-[200px]"
                    onClick={() => fileInputRefs.current[index]?.click()}
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground font-medium">Select Image #{index + 1}</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[index] = el; }}
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
            disabled={isUploading}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Publish Drop"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

