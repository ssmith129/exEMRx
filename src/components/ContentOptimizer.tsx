import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react';

interface ReadabilityMetrics {
  fleschScore: number;
  avgSentenceLength: number;
  avgWordsPerSentence: number;
  passiveVoicePercentage: number;
  complexWordsPercentage: number;
  readingLevel: string;
  suggestions: string[];
}

interface ContentOptimizerProps {
  content: string;
  targetAudience?: 'general' | 'medical_professional' | 'patient';
  showMetrics?: boolean;
  className?: string;
}

export default function ContentOptimizer({
  content,
  targetAudience = 'general',
  showMetrics = true,
  className = ''
}: ContentOptimizerProps) {
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);
  const [optimizedContent, setOptimizedContent] = useState<string>('');

  // Calculate readability metrics
  const calculateMetrics = (text: string): ReadabilityMetrics => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
    
    const avgSentenceLength = words.length / sentences.length || 0;
    const avgSyllablesPerWord = syllables / words.length || 0;
    
    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Passive voice detection (simplified)
    const passiveVoiceCount = sentences.filter(sentence => 
      /\b(am|is|are|was|were|being|been|be)\s+\w+ed\b/.test(sentence.toLowerCase())
    ).length;
    const passiveVoicePercentage = (passiveVoiceCount / sentences.length) * 100;
    
    // Complex words (3+ syllables)
    const complexWords = words.filter(word => countSyllables(word) >= 3);
    const complexWordsPercentage = (complexWords.length / words.length) * 100;
    
    const readingLevel = getReadingLevel(fleschScore);
    const suggestions = generateSuggestions(fleschScore, avgSentenceLength, passiveVoicePercentage, targetAudience);
    
    return {
      fleschScore: Math.round(fleschScore * 10) / 10,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgWordsPerSentence: Math.round(avgSentenceLength * 10) / 10,
      passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
      complexWordsPercentage: Math.round(complexWordsPercentage * 10) / 10,
      readingLevel,
      suggestions
    };
  };

  // Count syllables in a word
  const countSyllables = (word: string): number => {
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i].toLowerCase());
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e'
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  };

  // Get reading level based on Flesch score
  const getReadingLevel = (score: number): string => {
    if (score >= 90) return 'Elementary School';
    if (score >= 80) return 'Middle School';
    if (score >= 70) return 'High School';
    if (score >= 60) return 'College';
    if (score >= 50) return 'Graduate';
    if (score >= 30) return 'Postgraduate';
    return 'Expert';
  };

  // Generate improvement suggestions
  const generateSuggestions = (
    fleschScore: number, 
    avgSentenceLength: number, 
    passiveVoice: number,
    audience: string
  ): string[] => {
    const suggestions: string[] = [];
    
    const targets = {
      general: { minFlesch: 60, maxSentenceLength: 20, maxPassive: 10 },
      medical_professional: { minFlesch: 50, maxSentenceLength: 25, maxPassive: 15 },
      patient: { minFlesch: 70, maxSentenceLength: 15, maxPassive: 5 }
    };
    
    const target = targets[audience as keyof typeof targets];
    
    if (fleschScore < target.minFlesch) {
      suggestions.push('Simplify complex sentences and use shorter words');
    }
    
    if (avgSentenceLength > target.maxSentenceLength) {
      suggestions.push(`Break long sentences into shorter ones (current: ${avgSentenceLength} words, target: <${target.maxSentenceLength})`);
    }
    
    if (passiveVoice > target.maxPassive) {
      suggestions.push(`Reduce passive voice usage (current: ${passiveVoice}%, target: <${target.maxPassive}%)`);
    }
    
    if (fleschScore > 90) {
      suggestions.push('Content may be too simple for professional audience');
    }
    
    return suggestions;
  };

  // Optimize content automatically
  const optimizeContent = (text: string): string => {
    let optimized = text;
    
    // Break long sentences
    optimized = optimized.replace(/,\s+and\s+/g, '. ');
    optimized = optimized.replace(/,\s+but\s+/g, '. However, ');
    optimized = optimized.replace(/,\s+so\s+/g, '. Therefore, ');
    
    // Convert passive voice to active (simplified)
    optimized = optimized.replace(/\bis\s+(\w+ed)\s+by\s+(\w+)/g, '$2 $1');
    optimized = optimized.replace(/\bwas\s+(\w+ed)\s+by\s+(\w+)/g, '$2 $1');
    
    // Simplify medical terms (example replacements)
    const medicalTerms: { [key: string]: string } = {
      'myocardial infarction': 'heart attack',
      'cerebrovascular accident': 'stroke',
      'hypertension': 'high blood pressure',
      'diabetes mellitus': 'diabetes',
      'pharmaceutical': 'medicine',
      'administered': 'given',
      'utilized': 'used',
      'demonstrate': 'show',
      'facilitate': 'help',
      'implement': 'use'
    };
    
    if (targetAudience === 'patient') {
      Object.entries(medicalTerms).forEach(([complex, simple]) => {
        const regex = new RegExp(`\\b${complex}\\b`, 'gi');
        optimized = optimized.replace(regex, simple);
      });
    }
    
    return optimized;
  };

  useEffect(() => {
    if (content.trim()) {
      const calculatedMetrics = calculateMetrics(content);
      setMetrics(calculatedMetrics);
      
      if (calculatedMetrics.suggestions.length > 0) {
        setOptimizedContent(optimizeContent(content));
      }
    }
  }, [content, targetAudience]);

  const getScoreColor = (score: number, type: 'flesch' | 'sentence' | 'passive'): string => {
    const thresholds = {
      flesch: { good: 60, warning: 30 },
      sentence: { good: 20, warning: 30 },
      passive: { good: 10, warning: 20 }
    };
    
    const threshold = thresholds[type];
    
    if (type === 'flesch') {
      if (score >= threshold.good) return 'text-green-600 bg-green-50';
      if (score >= threshold.warning) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    } else {
      if (score <= threshold.good) return 'text-green-600 bg-green-50';
      if (score <= threshold.warning) return 'text-yellow-600 bg-yellow-50';
      return 'text-red-600 bg-red-50';
    }
  };

  if (!metrics) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        Enter content to analyze readability...
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Readability Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Readability Analysis</h3>
          </div>
          <div className="text-sm text-gray-500">
            Target: {targetAudience.replace('_', ' ')}
          </div>
        </div>

        {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${getScoreColor(metrics.fleschScore, 'flesch')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Flesch Score</p>
                  <p className="text-2xl font-bold">{metrics.fleschScore}</p>
                  <p className="text-xs">{metrics.readingLevel}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-60" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getScoreColor(metrics.avgSentenceLength, 'sentence')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Avg Sentence Length</p>
                  <p className="text-2xl font-bold">{metrics.avgSentenceLength}</p>
                  <p className="text-xs">words per sentence</p>
                </div>
                <Target className="h-8 w-8 opacity-60" />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getScoreColor(metrics.passiveVoicePercentage, 'passive')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Passive Voice</p>
                  <p className="text-2xl font-bold">{metrics.passiveVoicePercentage}%</p>
                  <p className="text-xs">of sentences</p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-60" />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {metrics.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Improvement Suggestions
            </h4>
            <ul className="space-y-2">
              {metrics.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Optimized Content */}
      {optimizedContent && optimizedContent !== content && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Optimized Content</h3>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-800 leading-relaxed">{optimizedContent}</p>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>The optimized version improves readability by:</p>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Breaking long sentences into shorter ones</li>
              <li>• Converting passive voice to active voice</li>
              <li>• Simplifying complex medical terminology (for patient content)</li>
              <li>• Improving overall flow and clarity</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for content comparison
interface ContentComparisonProps {
  original: string;
  optimized: string;
  className?: string;
}

export function ContentComparison({ original, optimized, className = '' }: ContentComparisonProps) {
  const originalMetrics = React.useMemo(() => {
    // Simplified metrics calculation for comparison
    const sentences = original.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = original.toLowerCase().match(/\b\w+\b/g) || [];
    return {
      sentences: sentences.length,
      words: words.length,
      avgSentenceLength: Math.round((words.length / sentences.length) * 10) / 10
    };
  }, [original]);

  const optimizedMetrics = React.useMemo(() => {
    const sentences = optimized.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = optimized.toLowerCase().match(/\b\w+\b/g) || [];
    return {
      sentences: sentences.length,
      words: words.length,
      avgSentenceLength: Math.round((words.length / sentences.length) * 10) / 10
    };
  }, [optimized]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Before & After Comparison</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Original</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800 text-sm leading-relaxed">{original}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-700">{originalMetrics.sentences}</div>
              <div className="text-red-600">Sentences</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-700">{originalMetrics.words}</div>
              <div className="text-red-600">Words</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-700">{originalMetrics.avgSentenceLength}</div>
              <div className="text-red-600">Avg/Sentence</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Optimized</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-800 text-sm leading-relaxed">{optimized}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-700">{optimizedMetrics.sentences}</div>
              <div className="text-green-600">Sentences</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-700">{optimizedMetrics.words}</div>
              <div className="text-green-600">Words</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-700">{optimizedMetrics.avgSentenceLength}</div>
              <div className="text-green-600">Avg/Sentence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
