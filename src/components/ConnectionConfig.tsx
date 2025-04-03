
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload, Download, HardDrive, Trash2, PlusCircle, KeyRound, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportChatsToFile, importChatsFromFile, setSaveLocation } from '@/utils/fileUtils';
import { VoiceInfo } from '@/hooks/useVoice';
import { Switch } from '@/components/ui/switch';
import VoiceRecorder from './VoiceRecorder';
import * as browserVoiceService from '@/services/browserVoiceService';
import { testMistralConnection, testStableDiffusionConnection } from '@/services/localAiService';
