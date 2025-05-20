import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, AlertCircle } from "lucide-react";

interface Quote {
  content: string;
  author: string;
}

const QuoteCard = () => {
  const MAX_RETRIES = 3;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchQuote = async (attempts = 0) => {
    setRetryCount(attempts);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.quotable.io/random");

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();
      setQuote({
        content: data.content,
        author: data.author,
      });
    } catch (err) {
      setError("Failed to load quote. Try again!");
      console.error("Error fetching quote:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch a quote when the component mounts
    fetchQuote();
  }, []);

  const handleShareToX = () => {
    if (!quote) {
      alert("Please generate a quote first!");
      return;
    }

    const shareText = encodeURIComponent(
      `"${quote.content}" - ${quote.author}`,
    );
    const shareUrl = `https://x.com/intent/post?text=${shareText}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md">
      <CardContent className="pt-6 px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div
            className="text-center py-6 text-red-500 flex flex-col items-center gap-3"
            id="quote-text"
          >
            <AlertCircle className="h-8 w-8" />
            <p>{error}</p>
            {retryCount >= MAX_RETRIES && (
              <Button
                onClick={() => fetchQuote(0)}
                variant="outline"
                className="mt-2"
              >
                Try Again
              </Button>
            )}
          </div>
        ) : quote ? (
          <>
            <blockquote className="text-xl mb-4 text-gray-700" id="quote-text">
              "{quote.content}"
            </blockquote>
            <p className="text-right text-gray-500 italic" id="author-text">
              - {quote.author}
            </p>
          </>
        ) : (
          <div className="text-center py-8 text-gray-400 flex flex-col items-center gap-2">
            <p>Click "New Quote" to get started</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-4 p-6 pt-2">
        <Button
          id="new-quote-btn"
          onClick={fetchQuote}
          disabled={isLoading}
          className="bg-[#007bff] hover:bg-[#0056b3] text-white flex-1"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "New Quote"
          )}
        </Button>
        <Button
          id="share-btn"
          onClick={handleShareToX}
          disabled={isLoading || !quote}
          className="bg-[#007bff] hover:bg-[#0056b3] text-white flex-1"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share to X
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuoteCard;
