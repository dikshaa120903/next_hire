import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / "ml" / "resume_model.pkl"


def _train_default_model():
    try:
        import numpy as np
        from sklearn.ensemble import RandomForestRegressor
    except ImportError as exc:
        raise ImportError("scikit-learn and numpy are required. Install with: pip install scikit-learn numpy") from exc
    features = np.array(
        [
            [2, 1, 1, 20],
            [4, 2, 2, 35],
            [6, 2, 3, 45],
            [8, 3, 4, 60],
            [10, 3, 5, 70],
            [12, 4, 6, 82],
            [14, 4, 7, 90],
            [5, 1, 1, 30],
            [7, 2, 2, 52],
            [9, 3, 4, 66],
        ]
    )
    targets = np.array([35, 48, 55, 66, 74, 83, 92, 44, 60, 71], dtype=float)
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(features, targets)
    return model


def load_resume_model():
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    if MODEL_PATH.exists():
        with MODEL_PATH.open("rb") as model_file:
            return pickle.load(model_file)
    model = _train_default_model()
    with MODEL_PATH.open("wb") as model_file:
        pickle.dump(model, model_file)
    return model


def predict_resume_score(features: dict) -> float:
    model = load_resume_model()
    vector = [
        [
            float(features.get("skills_count", 0)),
            float(features.get("projects_count", 0)),
            float(features.get("experience_years", 0)),
            float(features.get("keyword_match_percent", 0)),
        ]
    ]
    prediction = float(model.predict(vector)[0])
    return max(0.0, min(100.0, round(prediction, 2)))
