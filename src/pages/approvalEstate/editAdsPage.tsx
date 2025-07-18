import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
} from "@mui/material";

import { useAmenities } from "@hooks/api/lists/useLists";
import { useCategory } from "@hooks/api/category/useGetAllCategory";
import { useEditAd } from "@hooks/api/ads/useUpdateAd";

import LabeledTextField from "./components/form/LabeledTextField";
import LabeledSelect from "./components/form/LabeledSelect";
import AmenitiesSelect from "./components/form/AmenitiesSelect";
import ImageUploader from "./components/form/ImageUploader";

import { RentalPeriod } from "@/types/property";

const styles = {
  container: {
    p: 4,
    maxWidth: 1000,
    mx: "auto",
    mt: 5,
    borderRadius: 3,
    boxShadow: 4,
  },
  sectionTitle: { variant: "h4" as const, fontWeight: 600, gutterBottom: true },
  divider: { mb: 3 },
};

function FormSection({ children }: { children: React.ReactNode }) {
  return (
    <Grid container spacing={3}>
      {children}
    </Grid>
  );
}

export default function EditAdPagePreview() {
  const { adId } = useParams<{ adId: string }>();
  const navigate = useNavigate();
  const { ad, loading, fetchAd, updateAd } = useEditAd();

  const categories = useCategory();
  const amenitiesList = useAmenities();

  // — Form state
  const [formType, setFormType] = useState<"Sale" | "Rent">("Sale");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [rooms, setRooms] = useState(0);
  const [floors, setFloors] = useState(0);
  const [floorNumber, setFloorNumber] = useState(0);
  const [area, setArea] = useState(0);
  const [priceSYP, setPriceSYP] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [ownershipType, setOwnershipType] = useState("");
  const [furnishingType, setFurnishingType] = useState("");
  const [orientation, setOrientation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const furnishingOptions = [
    { id: "Furnished", name: "Furnished" },
    { id: "Unfurnished", name: "Unfurnished" },
    { id: "Semi-furnished", name: "Semi-furnished" },
  ];

  const [existingImages, setExistingImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [replacedImages, setReplacedImages] = useState<
    { id: string; file: File }[]
  >([]);

  const initialRentalPeriods: RentalPeriod[] = useMemo(
    () => [
      { _id: "rp0", period: "Daily", priceSYP: 0, priceUSD: 0 },
      { _id: "rp1", period: "Weekly", priceSYP: 0, priceUSD: 0 },
      { _id: "rp2", period: "Monthly", priceSYP: 0, priceUSD: 0 },
      { _id: "rp3", period: "Yearly", priceSYP: 0, priceUSD: 0 },
    ],
    []
  );
  const [rentalPeriods, setRentalPeriods] =
    useState<RentalPeriod[]>(initialRentalPeriods);

  // — Fetch ad on mount
  useEffect(() => {
    if (adId) fetchAd(adId);
  }, [adId, fetchAd]);

  // — Sync API → form
  const syncFromAd = useCallback(() => {
    if (!ad) return;
    setFormType(ad.type as "Sale" | "Rent");
    setDescriptionEn(ad["description[en]"]);
    setDescriptionAr(ad["description[ar]"]);
    setRooms(ad.rooms);
    setFloors(ad.floors);
    setFloorNumber(ad.floorNumber);
    setArea(ad.area);
    setPriceSYP(ad.priceSYP || 0);
    setPriceUSD(ad.priceUSD || 0);
    setOwnershipType(ad.ownershipType);
    setFurnishingType(ad.furnishingType);
    setOrientation(ad.orientation);

    // rental periods
    if (ad.type === "Rent" && ad.rentalPeriods) {
      setRentalPeriods(
        initialRentalPeriods.map((rp) => {
          const match = ad.rentalPeriods.find((x) => x.period === rp.period);
          return match
            ? { ...rp, priceSYP: match.priceSYP, priceUSD: match.priceUSD }
            : rp;
        })
      );
    }

    // category & province
    setCategoryId(
      categories.categories?.find(
        (c) =>
          c["name[en]"] === ad["category[en]"] &&
          c["name[ar]"] === ad["category[ar]"]
      )?.id || ""
    );
    // amenities
    if (Array.isArray(ad.menities) && amenitiesList.length) {
      setSelectedAmenities(
        amenitiesList
          .filter((a) => ad.menities.includes(a.name))
          .map((a) => a._id)
      );
    } else {
      setSelectedAmenities([]);
    }

    // images
    setExistingImages(
      ad.images?.map((img) => ({ id: img.id, url: img.url })) || []
    );
    setNewImages([]);
  }, [ad, categories.categories, amenitiesList, initialRentalPeriods]);

  useEffect(() => {
    syncFromAd();
  }, [syncFromAd]);

  const handleRentalChange = (
    idx: number,
    field: keyof RentalPeriod,
    value: number
  ) => {
    setRentalPeriods((prev) =>
      prev.map((rp, i) => (i === idx ? { ...rp, [field]: value } : rp))
    );
  };

  // — Back & Save
  const handleBack = () => navigate(-1);

  const handleSave = async () => {
    if (!adId) return;
    const body = new FormData();
    body.append("type", formType);
    body.append("description[en]", descriptionEn);
    body.append("description[ar]", descriptionAr);
    body.append("priceSYP", String(priceSYP));
    body.append("rooms", String(rooms));
    body.append("floors", String(floors));
    body.append("floorNumber", String(floorNumber));
    body.append("area", String(area));
    body.append("ownershipType", ownershipType);
    body.append("furnishingType", furnishingType);
    body.append("orientation", orientation);
    body.append("category", categoryId);
    (selectedAmenities || []).forEach((aid, index) =>
      body.append(`amenities[${index}]`, String(aid))
    );
    replacedImages.forEach(({ id, file }, index) => {
      body.append(`replaceImages[${index}]`, id);
      body.append(`images[${index}]`, file);
    });

    try {
      await updateAd(adId, body);
      navigate(-1);
    } catch {
      // error shown by hook
    }
  };

  const handleReplaceImage = (idx: number, file: File) => {
    const id = existingImages[idx]?.id;
    if (!id) return;

    setReplacedImages((prev) => [...prev, { id, file }]);

    // Visually replace the old image with new preview
    const url = URL.createObjectURL(file);
    setExistingImages((imgs) =>
      imgs.map((img, i) => (i === idx ? { ...img, url } : img))
    );
  };

  if (loading) return <Typography>Loading…</Typography>;

  // --- Render ---
  return (
    <Paper sx={styles.container}>
      <Typography {...styles.sectionTitle}>Edit Listing</Typography>
      <Divider sx={styles.divider} />

      <Box component="form" noValidate autoComplete="off">
        {/* Form Type */}
        <FormSection>
          <Grid size={{ xs: 12 }}>
            <RadioGroup
              row
              value={formType}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormType(e.target.value as "Sale" | "Rent")
              }
            >
              <FormControlLabel value="Sale" control={<Radio />} label="Sale" />
              <FormControlLabel value="Rent" control={<Radio />} label="Rent" />
            </RadioGroup>
          </Grid>
        </FormSection>
        <div className="my-3" />
        {/* Descriptions */}
        <FormSection>
          <Grid size={{ xs: 12 }}>
            <LabeledTextField
              label="Description (AR)"
              value={descriptionAr}
              onChange={setDescriptionAr}
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LabeledTextField
              label="Description (EN)"
              value={descriptionEn}
              onChange={setDescriptionEn}
              multiline
              rows={2}
            />
          </Grid>
        </FormSection>
        <div className="my-4" />
        {/* Basic Info */}
        <FormSection>
          {[
            { label: "Rooms", value: rooms, setter: setRooms },
            { label: "Floors", value: floors, setter: setFloors },
            { label: "Floor #", value: floorNumber, setter: setFloorNumber },
            { label: "Area (m²)", value: area, setter: setArea },
          ].map(({ label, value, setter }) => (
            <Grid key={label} size={{ xs: 6, sm: 3 }}>
              <LabeledTextField
                label={label}
                type="number"
                value={value}
                onChange={setter}
              />
            </Grid>
          ))}
        </FormSection>
        <div className="my-4" />
        {/* Pricing */}
        <FormSection>
          {formType === "Sale" ? (
            <>
              <Grid size={{ xs: 6, sm: 4 }}>
                <LabeledTextField
                  label="Price (SYP)"
                  type="number"
                  value={priceSYP}
                  onChange={setPriceSYP}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <LabeledTextField
                  label="Price (USD)"
                  type="number"
                  value={priceUSD}
                  onChange={setPriceUSD}
                />
              </Grid>
            </>
          ) : (
            rentalPeriods.map((rp, idx) => (
              <Grid key={rp._id} size={{ xs: 12, sm: 6, md: 3 }}>
                <LabeledTextField
                  label="Period"
                  value={rp.period}
                  disabled
                  onChange={() => {}}
                />
                <div className="my-4" />
                <LabeledTextField
                  label="Price (SYP)"
                  type="number"
                  value={rp.priceSYP}
                  onChange={(v) =>
                    handleRentalChange(idx, "priceSYP", Number(v))
                  }
                />
                <div className="my-4" />
                <LabeledTextField
                  label="Price (USD)"
                  type="number"
                  value={rp.priceUSD}
                  onChange={(v) =>
                    handleRentalChange(idx, "priceUSD", Number(v))
                  }
                />
              </Grid>
            ))
          )}
        </FormSection>
        <div className="my-4" />
        {/* Details */}
        <FormSection>
          <Grid size={{ xs: 12, sm: 4 }}>
            <LabeledTextField
              label="Ownership Type"
              value={ownershipType}
              onChange={setOwnershipType}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <LabeledSelect
              label="Furnishing Type"
              value={furnishingType}
              options={furnishingOptions}
              onChange={setFurnishingType}
              getOptionLabel={(o) => o.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <LabeledTextField
              label="Orientation"
              value={orientation}
              onChange={setOrientation}
            />
          </Grid>
        </FormSection>

        <div className="my-4" />
        {/* Selects */}
        <FormSection>
          <Grid size={{ xs: 12 }}>
            <LabeledSelect
              label="Category"
              value={categoryId}
              options={categories.categories || []}
              onChange={setCategoryId}
              getOptionLabel={(c) => `${c["name[en]"]} / ${c["name[ar]"]}`}
            />
          </Grid>
        </FormSection>
        <div className="my-4" />
        {/* Amenities & Images */}
        <FormSection>
          <Grid size={{ xs: 12 }}>
            <AmenitiesSelect
              amenitiesList={amenitiesList}
              selectedAmenities={selectedAmenities}
              onChange={setSelectedAmenities}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ImageUploader
              existingImages={existingImages}
              newImages={newImages}
              onAdd={(files) => setNewImages((prev) => [...prev, ...files])}
              onRemoveExisting={(idx) =>
                setExistingImages((imgs) => imgs.filter((_, i) => i !== idx))
              }
              onRemoveNew={(idx) =>
                setNewImages((imgs) => imgs.filter((_, i) => i !== idx))
              }
              onReplace={handleReplaceImage}
            />
          </Grid>
        </FormSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
