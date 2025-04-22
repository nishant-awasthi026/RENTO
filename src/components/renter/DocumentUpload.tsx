
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, FileText, Check, AlertCircle } from "lucide-react";
import { userAPI } from "@/utils/api";

const DocumentUpload = () => {
  const [documentType, setDocumentType] = useState<string>("driving_license");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    
    // Create preview URL for image
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!documentNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a document number",
        variant: "destructive",
      });
      return;
    }
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a document file",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("documentNumber", documentNumber);
      formData.append("document", file);
      
      await userAPI.uploadDocument(formData);
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      // Reset form after successful upload
      setDocumentNumber("");
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Document upload failed:", error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Identification Document</CardTitle>
        <CardDescription>
          Please upload your identification document for verification
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="aadhar_card">Aadhar Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-number">Document Number</Label>
            <Input
              id="document-number"
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Enter document number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-file">Upload Document</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="document-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or PDF (Max 5MB)
                    </p>
                  </div>
                )}
                <input
                  id="document-file"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              Make sure your document is clearly visible and all details are readable. 
              We'll verify this information for compliance and security purposes.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark"
            disabled={isUploading}
          >
            {isUploading ? (
              <>Uploading... <span className="ml-2 animate-spin">⟳</span></>
            ) : (
              <>Upload Document</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentUpload;
