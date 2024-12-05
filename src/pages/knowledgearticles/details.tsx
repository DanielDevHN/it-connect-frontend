// import { useState, useCallback } from 'react';
import { GenericDetailsPage } from "../detailslayout";
import { formatDate } from "@/lib/utils";
import { knowledgearticleService } from "./knowledgearticle.service";
import { Category } from "@/schemas/categoriesschema";
import { Asset } from "@/schemas/assetsschema";
// import { Button } from "@/components/ui/button";
import { IconExternalLink } from '@tabler/icons-react';

export default function KnowledgeArticleDetailsPage() {
  // const [isDownloading, setIsDownloading] = useState(false);

  // const handleDownload = useCallback(async (url: string) => {
  //   setIsDownloading(true);
  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = url.substring(url.lastIndexOf('/') + 1);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // }, []);

  return (
    <GenericDetailsPage
      entityName="Know Ledge Article"
      service={knowledgearticleService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Title", value: "title" },
        { label: "Categories", value: (item) => item.categories.map((category:Category) => category.name).join(", ") },
        { label: "Assets", value: (item) => 
          item.assets.map((assetArticle:{id:number, assetId:number, articleId:number, asset:Asset}) => 
            assetArticle.asset.name).join(", ") 
        },
        { 
          label: "Document", 
          value: (item) => (
            <div className="flex items-center space-x-2">
              <a href={item.docUrl} className='flex items-center hover:underline' target="_blank" rel="noopener noreferrer">
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  Open
                </a>
            </div>
          )
        },
        { label: "Created By", value: (user) => user.createdBy?.name },
        { label: "Last Modified By", value: (user) => user.lastModifiedBy?.name },
        { label: "Created At", value: (user) => formatDate(user.createdAt) },
        { label: "Updated At", value: (user) => formatDate(user.updatedAt) },
      ]}
    />
  );
}

