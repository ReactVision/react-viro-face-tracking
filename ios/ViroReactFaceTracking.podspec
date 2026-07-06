require 'json'
package = JSON.parse(File.read(File.join(__dir__, '../package.json')))

Pod::Spec.new do |s|
  s.name             = 'ViroReactFaceTracking'
  s.version          = package['version']
  s.summary          = 'Front-camera (ARKit face-tracking) AR provider for @reactvision/react-viro'
  s.homepage         = 'https://github.com/ReactVision/react-viro-face-tracking'
  s.license          = { :type => 'MIT' }
  s.author           = 'ReactVision'
  s.platform         = :ios, '14.0'
  s.source           = { :git => 'https://github.com/ReactVision/react-viro-face-tracking.git', :tag => "v#{s.version}" }

  s.source_files     = '*.{h,m,mm}'

  # ARKit provides ARFaceTrackingConfiguration (TrueDepth). This pod is the ONLY
  # place in the app that references it, so the core ViroKit binary stays free of
  # the TrueDepth API. ARKit is a system framework — nothing is vendored.
  s.frameworks       = 'ARKit', 'Foundation'

  s.pod_target_xcconfig = {
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
    'OTHER_CPLUSPLUSFLAGS'        => '$(inherited) -std=c++17',
  }

  # No React or ViroReact pod dependencies — VROFrontCameraProvider (in ViroKit) is
  # located at runtime via NSClassFromString (mirrors react-viro-onnx). React/Viro
  # symbols are resolved from the host app.
end
