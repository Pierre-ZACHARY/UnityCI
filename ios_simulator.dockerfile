FROM unityci/editor:ubuntu-2023.1.3f1-ios-1.1.2

WORKDIR /app

# --build-arg UNITY_LICENSE="$UNITY_LICENSE"
ARG UNITY_LICENSE
RUN echo $UNITY_LICENSE > UnityLicense.ulf

COPY ./Assets ./Assets
COPY ./Packages ./Packages
COPY ./ProjectSettings ./ProjectSettings

# Activate Unity
#RUN /opt/unity/Editor/Unity -batchmode -manualLicenseFile UnityLicense.ulf -logfile -
# Generate Unity Project
#RUN /opt/unity/Editor/Unity -batchmode -createProject /app -logfile -
# Execute Build Ios Simulator which is a custom editor script, output to Builds/iOS
#RUN /opt/unity/Editor/Unity -batchmode -projectPath /app -executeMethod Editor.BuildIosSimulator.BuildiOS -logfile 

#RUN ls -la /app/Builds/iOS