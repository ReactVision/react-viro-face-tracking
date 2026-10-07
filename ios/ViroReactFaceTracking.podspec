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

  s.frameworks       = 'ARKit', 'Foundation'

  # ViroFaceTrackingModule.mm is a React Native module, so it needs the bridge headers.
  # ViroFaceTracking.mm itself still links nothing: it resolves ViroKit at runtime.
  s.dependency 'React-Core'

  # The config plugin adds `import ViroReactFaceTracking` to a Swift AppDelegate. Depending
  # on React-Core makes Expo's precompiled modules build this pod as a static library,
  # which gets no module map unless one is asked for.
  s.pod_target_xcconfig = {
    'DEFINES_MODULE'              => 'YES',
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
    'OTHER_CPLUSPLUSFLAGS'        => '$(inherited) -std=c++17',
  }
end
