import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from .feature_extractor import FeatureExtractor  # Import the new class

class PhishingDetector:
    def __init__(self, dataset_path='phishing.csv'):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        dataset_path = os.path.join(script_dir, 'phishing.csv')
        self.data = pd.read_csv(dataset_path)
        self.feature_extractor = FeatureExtractor()  # Initialize the extractor
        self.prepare_data()
        self.train_model()

    def prepare_data(self):
        self.data['status'] = self.data['status'].map({'phishing': 1, 'legitimate': 0})
        self.x = self.data.drop(['status'], axis=1)
        self.y = self.data['status']
        self.x = self.x.dropna(axis=1, how='all')
        
        self.numeric_cols = self.x.select_dtypes(include=['number']).columns
        self.categorical_cols = self.x.select_dtypes(include=['object']).columns
        
        self.imputer = SimpleImputer(strategy='mean')
        X_numeric = pd.DataFrame(self.imputer.fit_transform(self.x[self.numeric_cols]), columns=self.numeric_cols)
        X_categorical = pd.get_dummies(self.x[self.categorical_cols], drop_first=True)
        
        self.X_processed = pd.concat([X_numeric, X_categorical], axis=1)
        self.scalar = StandardScaler()
        self.X_scaled = self.scalar.fit_transform(self.X_processed)

    def train_model(self):
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(self.X_scaled, self.y, test_size=0.2, random_state=42)
        self.model = RandomForestClassifier()
        self.model.fit(self.x_train, self.y_train)

    def predict_phishing(self, url):
        url_features = self.feature_extractor.extract_features(url)  # Call the extractor
        if url_features is None:
            print("Could not extract features from the URL")
            return None
        
        features_df = pd.DataFrame(columns=self.X_processed.columns)
        features_df.loc[0] = 0 
        
        for col, val in url_features.items():
            if col in features_df.columns:
                features_df.loc[0, col] = val
        
        features_scaled = self.scalar.transform(features_df)
        
        prediction = self.model.predict(features_scaled)
        probability = self.model.predict_proba(features_scaled)[0][1]
        
        print(f"Phishing Probability: {probability*100:.2f}%")
        print(f"Is Phishing: {bool(prediction[0])}")

if __name__ == '__main__':
    pass