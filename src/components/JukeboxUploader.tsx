
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tag, Music, Upload, X, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { JukeboxTrack } from '@/types/modules';

interface JukeboxUploaderProps {
  onUploadComplete: (track: Omit<JukeboxTrack, 'id' | 'createdAt' | 'updatedAt' | 'campaigns' | 'donations' | 'emotionalPoints' | 'viralClipPoints'>) => void;
  isAdmin: boolean;
}

const JukeboxUploader: React.FC<JukeboxUploaderProps> = ({ onUploadComplete, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('Elohim Network');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      } else {
        toast.error('Please select a valid audio file');
      }
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setCoverImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setCoverImagePreview(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('You need admin permissions to upload tracks');
      return;
    }
    
    if (!title || !artist || !audioFile) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real implementation, upload files to storage
      // Here we're just simulating the process
      
      // Create placeholder URLs
      const audioUrl = URL.createObjectURL(audioFile);
      const coverUrl = coverImagePreview || '/placeholder.svg';
      
      // Get audio duration (in a real app, you'd use Web Audio API)
      const duration = Math.floor(Math.random() * 240) + 120; // Random duration between 2-6 minutes
      
      onUploadComplete({
        title,
        artist,
        audioUrl,
        coverImageUrl: coverUrl,
        duration,
        tags
      });
      
      // Clear form
      setTitle('');
      setArtist('Elohim Network');
      setTags([]);
      setAudioFile(null);
      setCoverImage(null);
      setCoverImagePreview(null);
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload track. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload New Track</CardTitle>
        <CardDescription>Add a new track to your Jukebox Hero collection</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter track title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-24 bg-muted rounded flex items-center justify-center overflow-hidden"
                onClick={() => imageInputRef.current?.click()}
              >
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => imageInputRef.current?.click()}
                >
                  Choose Cover Image
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 500x500px
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audio" className="block">Audio File *</Label>
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant={audioFile ? "default" : "outline"}
                onClick={() => audioInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                {audioFile ? 'File Selected' : 'Upload Audio File'}
              </Button>
              {audioFile && (
                <span className="text-sm text-muted-foreground">
                  {audioFile.name}
                </span>
              )}
            </div>
            <Input
              id="audio"
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              required
              className="hidden"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" type="button">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isUploading || !isAdmin || !title || !artist || !audioFile}
        >
          {isUploading ? 'Uploading...' : 'Upload Track'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JukeboxUploader;
