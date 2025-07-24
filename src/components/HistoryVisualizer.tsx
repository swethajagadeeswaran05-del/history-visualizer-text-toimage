import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ImageIcon, Sparkles, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/history-hero.jpg";

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

const EXAMPLE_PROMPTS = [
  "The signing of the Declaration of Independence in 1776, with founding fathers gathered around a wooden table in Independence Hall",
  "Napoleon Bonaparte crossing the Alps in 1800, leading his army through treacherous mountain passes",
  "The construction of the Great Wall of China during the Ming Dynasty, with thousands of workers on steep mountainous terrain",
  "Leonardo da Vinci's workshop during the Renaissance, surrounded by inventions, paintings, and scientific drawings",
  "The ancient Library of Alexandria in its golden age, with scholars studying scrolls among towering shelves"
];

export default function HistoryVisualizer() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const enhanceHistoricalPrompt = (userInput: string): string => {
    const contextualEnhancements = [
      "historically accurate",
      "period-appropriate clothing and architecture",
      "authentic historical setting",
      "detailed historical context",
      "museum quality illustration style"
    ];
    
    const visualEnhancements = [
      "cinematic lighting",
      "rich colors and textures",
      "high detail and resolution",
      "professional historical illustration style"
    ];

    const fullPrompt = `${userInput}. ${contextualEnhancements.join(", ")}, ${visualEnhancements.join(", ")}. Ultra high resolution historical artwork.`;
    
    return fullPrompt;
  };

  const generateHistoricalImage = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a historical event description");
      return;
    }

    setIsGenerating(true);
    
    try {
      const enhancedPrompt = enhanceHistoricalPrompt(inputText);
      
      // Simulate AI image generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated image for demo
      const mockImage: GeneratedImage = {
        url: `https://picsum.photos/800/600?random=${Date.now()}`,
        prompt: enhancedPrompt,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [mockImage, ...prev]);
      toast.success("Historical image generated successfully!");
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-parchment">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Historical Visualization" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              History Visualizer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Transform historical narratives into stunning visual representations using AI technology
            </p>
            <div className="flex items-center justify-center gap-2 text-accent-foreground">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-manuscript">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Describe Historical Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter a detailed description of a historical event you'd like to visualize..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-32 resize-none"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={generateHistoricalImage}
                    disabled={isGenerating || !inputText.trim()}
                    variant="golden"
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
                        Generate Historical Image
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <Card className="shadow-manuscript">
              <CardHeader>
                <CardTitle className="text-lg">Example Historical Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="manuscript"
                      className="w-full text-left justify-start h-auto p-3 text-sm leading-relaxed"
                      onClick={() => useExamplePrompt(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Images Section */}
          <div className="space-y-6">
            <Card className="shadow-manuscript">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Generated Historical Visualizations
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
                    <p className="text-sm">Enter a historical description and click generate to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {generatedImages.map((image, index) => (
                      <div key={index} className="space-y-3">
                        <div className="relative group">
                          <img
                            src={image.url}
                            alt="Generated historical visualization"
                            className="w-full rounded-lg shadow-manuscript hover:shadow-glow transition-shadow duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Generated {new Date(image.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-foreground/80 bg-muted p-3 rounded-md">
                            <strong>Enhanced Prompt:</strong> {image.prompt}
                          </p>
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
  );
}