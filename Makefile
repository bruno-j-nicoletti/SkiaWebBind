.PHONY : release
release :
	if [ ! -d build ] ; then mkdir build; fi
	emcmake cmake -GNinja -B build .
	cd build; ninja

.PHONY : skia
skia :
	./build-skia.py --pthread --shallow

.PHONE: clean
clean:
	rm -rf build
