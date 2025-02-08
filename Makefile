.PHONY : release
release :
	if [ ! -d build ] ; then mkdir build; fi
	emcmake cmake -GNinja -B build .
	cd build; ninja

.PHONY : skia
skia :
	./build-skia.py --pthread --shallow --config=Debug

.PHONE: clean
clean:
	rm -rf build

.PHONY : blah
blah :
	 make skia
	cd build; rm -f RawGL/rawGL.html ; ninja

.PHONE: clean
