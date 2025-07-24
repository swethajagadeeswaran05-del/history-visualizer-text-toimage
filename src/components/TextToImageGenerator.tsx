import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, ImageIcon, Sparkles, Download, Shuffle, RotateCcw, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import aiHero from "@/assets/ai-hero.jpg";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: number;
}

const STYLE_OPTIONS = [
  { value: "realistic", label: "Realistic" },
  { value: "3d", label: "3D Render" },
  { value: "anime", label: "Anime" },
  { value: "digital-art", label: "Digital Art" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "fantasy", label: "Fantasy" }
];

const SURPRISE_PROMPTS = [
  "A majestic dragon soaring over a neon-lit cyberpunk city at night",
  "An astronaut discovering a field of glowing crystal flowers on an alien planet",
  "A floating island with a waterfall cascading into clouds below",
  "A steampunk robot gardening in a greenhouse full of mechanical plants",
  "A magical library where books fly around like birds between floating shelves",
  "An underwater city with bioluminescent coral architecture",
  "A giant tree house city connected by bridges made of rainbow light",
  "A cosmic whale swimming through a nebula filled with starlight"
];

export default function TextToImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const generateImage = async (inputPrompt?: string) => {
    const currentPrompt = inputPrompt || prompt;
    
    if (!currentPrompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your Clipdrop API key");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Enhanced prompt with style
      const enhancedPrompt = `${currentPrompt}, ${selectedStyle} style, high quality, detailed`;
      
      const formData = new FormData();
      formData.append('prompt', enhancedPrompt);

      const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: currentPrompt,
        style: selectedStyle,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      toast.success("Image generated successfully!");
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const surpriseMe = () => {
    const randomPrompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(randomPrompt);
    toast.success("Surprise prompt loaded! Click generate to create your image.");
  };

  const regenerateImage = (originalPrompt: string, originalStyle: string) => {
    setPrompt(originalPrompt);
    setSelectedStyle(originalStyle);
    generateImage(originalPrompt);
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-ai opacity-10 rotate-12 animate-pulse-neon"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-neon opacity-5 -rotate-12"></div>
        </div>

        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={aiHero} 
            alt="AI Technology" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background/90" />
          
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="glass"
            size="icon"
            className="absolute top-4 right-4 z-10"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8 animate-fade-in">
              <h1 className="text-6xl font-bold bg-gradient-neon bg-clip-text text-transparent mb-4">
                AI Image Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Transform your imagination into stunning visuals with AI-powered image generation
              </p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">Powered by Clipdrop API</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* API Key Input */}
          {!apiKey && (
            <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Enter Your Clipdrop API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Your Clipdrop API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your API key from{" "}
                    <a 
                      href="https://clipdrop.co/apis" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Clipdrop API
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generation Controls */}
            <div className="space-y-6">
              <Card className="border-border/20 bg-card/30 backdrop-blur-md shadow-glass animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Create Your Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Textarea
                    placeholder="Describe the image you want..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-24 resize-none bg-background/50 border-border/50 focus:border-primary transition-colors"
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {STYLE_OPTIONS.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateImage()}
                      disabled={isGenerating || !prompt.trim() || !apiKey}
                      variant="ai"
                      size="lg"
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={surpriseMe}
                      variant="glass"
                      size="lg"
                    >
                      <Shuffle className="w-4 h-4" />
                      Surprise Me
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Images */}
            <div className="space-y-6">
              <Card className="border-border/20 bg-card/30 backdrop-blur-md shadow-glass animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Generated Images
                    {generatedImages.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {generatedImages.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedImages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No images generated yet.</p>
                      <p className="text-sm">Enter a prompt and click generate to begin.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {generatedImages.map((image) => (
                        <div key={image.id} className="space-y-3 animate-scale-in">
                          <div className="relative group">
                            <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full rounded-lg shadow-glass hover:shadow-neon transition-shadow duration-300"
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-sm text-foreground/80 bg-muted/50 p-3 rounded-md backdrop-blur-sm">
                              <strong>Prompt:</strong> {image.prompt}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => downloadImage(image.url, image.prompt)}
                                variant="glass"
                                size="sm"
                                className="flex-1"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                              <Button
                                onClick={() => regenerateImage(image.prompt, image.style)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Regenerate
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}