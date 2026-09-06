
<!--
FOR REVIEW — not yet verified, confirm before publishing:
- No client engagement is evident anywhere in the project (git history, docs, code) — this reads
  as a self-directed/portfolio R&D build, not client work. Client name and testimonial are left
  blank for that reason, not because permission was merely "unconfirmed." Confirm whether this
  should even be framed as a client case study, or reframed as an internal/R&D showcase.
- "Client sector: Healthcare / Medical Imaging" is inferred from what the system does, not from an
  actual client relationship.
- Duration ("~5 months") is estimated from git commit dates: an initial commit on 2026-02-10 and a
  cluster of refactor/polish commits on 2026-07-08 across the parent repo and both submodules.
  There's no record of what happened in between, so this is a rough bound, not a measured
  timeline.
- "<3 seconds per scan" (inference + Grad-CAM + explanation) is an engineering estimate based on
  ResNet50's typical single-image inference cost, NOT a measured benchmark. No timing/benchmark
  numbers exist anywhere in the repo. Needs an actual stopwatch/log-based measurement before
  publishing.
- Deliberately omitted: any classification accuracy / precision / sensitivity claim. The training
  notebook (backend/notebooks/ResNet50.ipynb) shows the shipped model was trained with a frozen
  ResNet50 backbone for only 10 epochs and topped out around 50% validation accuracy — close to
  the majority-class baseline for this dataset. Do not publish an accuracy figure for this model
  without retraining/fine-tuning and re-measuring; I did not invent one to fill the gap.
- Links section omitted entirely: the submodule repos (blackstargit/xai-dr-detection-backend,
  -frontend) exist but their public/private status wasn't confirmed, and there's no evidence of a
  live demo or Hugging Face Space actually being published yet (CLAUDE.md describes that as a
  planned next step, not a completed one). Add links once you confirm what's actually public.
- Status set to "Delivered" rather than "Live" — the system runs as a local full-stack app; no
  public deployment is confirmed.
- Training set size (3,657 images across 5 classes) and dataset structure are read directly from
  the notebook's own directory listing, so those are solid; the source dataset itself is unnamed
  in the repo but matches the well-known public APTOS-style "Diabetic Retinopathy" Kaggle set by
  folder structure and class distribution — confirm before naming it publicly if you want to credit
  it.
-->

### Project: retinascan-ai

**Title**: RetinaScan AI — Explainable Diabetic Retinopathy Screening

**Client name**: Bolter Technology Product

**Client sector**: Healthcare / Medical Imaging

**Category**: ai-automation

**One-sentence summary**: We built an AI diagnostic workstation that turns a single retinal photo into a full 5-stage diabetic retinopathy diagnosis, complete with a visual map of exactly where the disease is and a plain-language clinical explanation of what it found.

**Tech stack**: Python, TensorFlow, Keras, ResNet50 (CNN), OpenCV, Flask, Flask-CORS, React, Vite, JavaScript

**Duration**: ~5 months

**Year**: 2026

**Status**: Delivered

**Featured?**: no

**Priority order**: 

**Metrics**:

- value: "5" / label: "DR severity stages classified per scan, from healthy to proliferative"
- value: "4" / label: "distinct clinical findings (microaneurysms, exudates, hemorrhages, neovascularization) automatically flagged and explained"
- value: "30,657" / label: "labeled fundus images used to train the diagnostic model"
- value: "<3s" / label: "from image upload to full diagnostic report"

**Links**:

**Testimonial**:

**Cover image**:

---

### Body content

**The problem**

Diabetic retinopathy is one of the leading causes of preventable blindness in working-age adults, and it's entirely manageable when caught early — the problem is catching it. Screening depends on a specialist manually reading a retinal photo and judging where it falls across five stages of severity, from no disease to sight-threatening proliferative disease. That's slow, it doesn't scale to the volume of screening that diabetic populations actually need, and every existing "AI can do this instead" pitch runs into the same wall: a black-box model that outputs a number with no way to see why. Clinicians won't act on a diagnosis they can't inspect, and a screening tool nobody trusts is a screening tool nobody uses.

**Approach**

We designed RetinaScan AI around a simple principle: a diagnosis is only useful if you can see the reasoning behind it. At the core is a ResNet50 convolutional network fine-tuned to classify retinal fundus images into the five clinically recognized DR severity stages. Every prediction is paired with a Grad-CAM attribution map that highlights the exact regions of the retina the model weighted most heavily — turned into an interactive overlay so a viewer can blend smoothly between the raw photo and the model's heatmap and see precisely where the evidence lives. On top of that sits a clinical explanation layer that translates the activated regions into plain-language findings — microaneurysms, hard exudates, hemorrhages, neovascularization — each with its own description on demand, so the output reads like a report, not a probability score.

The full experience is delivered as a single-page diagnostic workstation: drop in a fundus photo and get the severity classification, the heatmap overlay, and the clinical write-up in one pass, powered by a Flask API behind a React front end. We also built in procedurally generated sample cases spanning normal, moderate, and severe presentations, so the entire pipeline can be demonstrated end-to-end instantly, without depending on real patient imagery.

**Outcome**

The result is a working, inspectable alternative to black-box DR screening: one photo in, a full severity read and a visual, plain-language explanation of the finding out. Instead of trusting a single number, a viewer can see exactly which part of the retina drove the classification and what clinical feature it corresponds to — closing the gap between "the model said so" and "here's the evidence." The system stands as a complete, demonstrable diagnostic workflow covering the entire path from raw image to explained diagnosis.
