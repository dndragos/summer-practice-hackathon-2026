"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profileActions";
import { TextField, Button, Typography, Box, Avatar, IconButton, Paper, Divider, Stack, Select, MenuItem, InputLabel, FormControl, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export default function ProfileClient({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [sports, setSports] = useState(user.sportPreferences || []);
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error("Upload failed with status:", res.status);
        return;
      }
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAiAutofill = async () => {
    if (!rawText) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/profile/ai-autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      if (!res.ok) {
        console.error("AI autofill failed with status:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        console.error("AI autofill: unexpected response type:", contentType);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const merged = [...sports, ...data]
          .filter((s: any) => s?.sportName && s?.skillLevel)
          .filter(
            (sport: any, index: number, arr: any[]) =>
              arr.findIndex(
                (item: any) =>
                  item.sportName.toLowerCase() === sport.sportName.toLowerCase()
              ) === index
          );
        setSports(merged);
        setRawText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddSport = () => {
    setSports([...sports, { sportName: "", skillLevel: "Beginner" }]);
  };

  const handleSportChange = (index: number, field: string, value: string) => {
    const updatedSports = [...sports];
    updatedSports[index] = { ...updatedSports[index], [field]: value };
    setSports(updatedSports);
  };

  const handleRemoveSport = (index: number) => {
    const updatedSports = sports.filter((_, i) => i !== index);
    setSports(updatedSports);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <form action={updateProfile}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Avatar src={imageUrl} sx={{ width: 120, height: 120, mb: 2 }} />
          <Button variant="contained" component="label" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Picture"}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Personal Info</Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 4 }}
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Sport Preferences</Typography>

        <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f8faff', borderColor: '#d0d7ff' }}>
          <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            ✨ AI Auto-Fill Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Just tell us what you like to play and how good you are, and our AI will automatically add the sports for you!
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="E.g., I like playing hoops and kicking a ball, im pretty good"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            sx={{ mb: 2, bgcolor: 'white' }}
            multiline
            rows={2}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={isAiLoading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
            onClick={handleAiAutofill}
            disabled={isAiLoading || !rawText}
          >
            {isAiLoading ? "Processing..." : "Extract Sports"}
          </Button>
        </Paper>
        
        {sports.map((sport: any, index: number) => (
          <Stack direction="row" spacing={2} key={index} sx={{ mb: 2 }}>
            <TextField
              label="Sport"
              value={sport.sportName}
              onChange={(e) => handleSportChange(index, "sportName", e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Skill Level</InputLabel>
              <Select
                value={sport.skillLevel}
                label="Skill Level"
                onChange={(e) => handleSportChange(index, "skillLevel", e.target.value)}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
                <MenuItem value="Pro">Pro</MenuItem>
              </Select>
            </FormControl>
            <IconButton color="error" onClick={() => handleRemoveSport(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddSport} sx={{ mb: 4 }}>
          Add Sport
        </Button>

        {/* Hidden input to pass sports data as JSON string to the Server Action */}
        <input type="hidden" name="sports" value={JSON.stringify(sports)} />
        <input type="hidden" name="image" value={imageUrl} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" type="submit" size="large">
            Save Changes
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
