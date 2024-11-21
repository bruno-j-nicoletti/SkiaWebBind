.PHONY : release
release :
	if [ ! -d build ] ; then mkdir build; fi
	emcmake cmake -GNinja -B build . -DSKIA_ROOT_DIR=/Users/bruno/Work/skia
	cd build; ninja


.PHONE: clean
clean:
	rm -rf build
